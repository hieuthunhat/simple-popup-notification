import {isEmpty} from '@avada/utils';
import {defaultSettingsData} from '../const/defaultSettings';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as settingsRepository from '../repositories/settingsRepository';
import {API_VERSION, initShopify} from '../services/shopifyService';
import fs from 'fs';
import path from 'path';

const configFilePath = path.resolve(__dirname, '../../.runtimeconfig.json');

/**
 * Sync products from a store
 *
 * @async
 * @param {{ shopDomain: any; accessToken: any; }} param0
 * @param {*} param0.shopDomain
 * @param {*} param0.accessToken
 */
export const syncOrdersGraphQL = async ({shopDomain, accessToken, orders = 30}) => {
  const URL = `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`;

  const query = `
    query {
      orders(first: ${orders}) {
        edges {
          node {
            id
            createdAt
            customer {
              firstName
              defaultAddress {
                city
                country
              }
            }
            lineItems(first: 1) {
              edges {
                node {
                  title
                  product {
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      shop {
        myshopifyDomain
      }
    }
  `;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query})
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    const ordersData = await response.json();
    const ordersList = ordersData.data.orders.edges;

    await Promise.all(
      ordersList.map(order => {
        const customer = order?.node?.customer;
        const lineItem = order?.node?.lineItems?.edges?.[0]?.node;

        return notificationsRepository.createOne({
          shopDomain: ordersData.data.shop?.myshopifyDomain,
          firstName: customer?.firstName,
          city: customer?.defaultAddress?.city,
          country: customer?.defaultAddress?.country,
          productId: order?.node?.id,
          productImage: lineItem?.product?.images?.edges?.[0]?.node?.url,
          productName: lineItem?.title,
          timestamp: order?.node?.createdAt
        });
      })
    );
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Create default settings for a shop
 *
 * @async
 * @param {{ shopId: any; }} param0
 * @param {*} param0.shopId
 * @returns {unknown}
 */
export const createDefaultSettings = async ({shopId}) => {
  try {
    const defaultData = await settingsRepository.createOne({
      data: defaultSettingsData,
      shopId: shopId
    });
    if (!defaultData) {
      console.log('Error when creating default settings services');
    }
    return defaultData;
  } catch (error) {
    console.error('Error hrere', error);
    return;
  }
};

/**
 * Register webhooks for app
 *
 * @async
 * @param {{}} param0
 * @returns {*}
 */
export const registerWebhook = async shopData => {
  try {
    const dataConfig = fs.readFileSync(configFilePath, 'utf-8');
    const parsedData = JSON.parse(dataConfig);
    const shopify = initShopify(shopData);

    const currentWebhooks = await shopify.webhook.list();

    const unusedHooks = currentWebhooks.filter(
      webhook => !webhook.address.includes(parsedData.app.base_url)
    );

    if (!isEmpty(unusedHooks)) {
      console.log(`Deleting ${unusedHooks.length} unused webhooks...`);
      await Promise.all(
        unusedHooks.map(async hook => {
          await shopify.webhook.delete(hook.id);
          console.log(`Deleted webhook ID: ${hook.id}`);
        })
      );
    }

    const webhook = await shopify.webhook.list({
      address: `https://${parsedData.app.base_url}/webhook/order/new`
    });

    if (webhook.length === 0) {
      const createdWebhook = await shopify.webhook.create({
        topic: 'orders/create',
        address: `https://${parsedData.app.base_url}/webhook/order/new`,
        format: 'json'
      });
      console.log('Webhook created successfully:', createdWebhook);
      return createdWebhook;
    }

    console.log('Webhook already exists');
  } catch (error) {
    console.error('Error registering webhook:', error);
  }
};

export const getProductImage = async ({id, shopDomain, accessToken}) => {
  const globalProductId = `gid://shopify/Product/${id}`;
  const URL = `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`;

  const query = `
    query GetProductImage($id: ID!) {
      product(id: $id) {
        id
        title
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {id: globalProductId}
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const product = data.data.product;
    const imageUrl = product?.images?.edges?.[0]?.node?.url || null;

    return {
      id: product?.id,
      title: product?.title,
      imageUrl
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
