import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import {isEmpty} from '@avada/utils';
import {defaultSettingsData} from '../const/defaultSettings';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as settingsRepository from '../repositories/settingsRepository';
import appConfig from '../config/app';

export const API_VERSION = '2025-07';
const {baseUrl} = appConfig;

/**
 * Create Shopify instance with the latest API version and auto limit enabled
 *
 * @param {Shop} shopData
 * @param {string} apiVersion
 * @return {Shopify} return a Shopify Object
 */
export function initShopify(shopData, apiVersion = API_VERSION) {
  const shopParsedData = prepareShopData(shopData.id, shopData, shopifyConfig.accessTokenKey);
  const {shopifyDomain, accessToken} = shopParsedData;

  return new Shopify({
    shopName: shopifyDomain,
    accessToken,
    apiVersion,
    autoLimit: true
  });
}

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
          timestamp: new Date(order?.node?.createdAt)
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
export const createDefaultSettings = async ({shopId, shopDomain}) => {
  try {
    const defaultData = await settingsRepository.createOne({
      data: defaultSettingsData,
      shopId: shopId,
      shopDomain: shopDomain
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
export const registerWebhook = async ({shopifyDomain, accessToken}) => {
  console.log(baseUrl);

  try {
    const shopify = new Shopify({
      shopName: shopifyDomain,
      accessToken
    });

    const currentWebhooks = await shopify.webhook.list();

    const unusedHooks = currentWebhooks.filter(webhook => !webhook.address.includes(baseUrl));

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
      address: `https://${appConfig.baseUrl}/webhook/order/new`
    });

    if (webhook.length === 0) {
      const createdWebhook = await shopify.webhook.create({
        topic: 'orders/create',
        address: `https://${appConfig.baseUrl}/webhook/order/new`,
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

export const registerScriptTag = async ({shopifyDomain, accessToken}) => {
  try {
    const shopify = new Shopify({
      shopName: shopifyDomain,
      accessToken
    });

    const existingScriptTags = await shopify.scriptTag.list();
    console.log('Existing script tags:', existingScriptTags);

    for (const tag of existingScriptTags) {
      await shopify.scriptTag.delete(tag.id);
      console.log(`Deleted script tag: ${tag.id} (${tag.src})`);
    }

    const scriptTag = await shopify.scriptTag.create({
      event: 'onload',
      src: 'https://localhost:3001/scripttag/avada-sale-pop.min.js'
    });
    console.log('Script tag registered successfully:', scriptTag);

    return scriptTag;
  } catch (error) {
    console.error('Error registering script tag:', error);
  }
};
