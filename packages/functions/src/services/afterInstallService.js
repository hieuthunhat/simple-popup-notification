import {defaultSettingsData} from '../const/defaultSettings';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as settingsRepository from '../repositories/settingsRepository';
import {API_VERSION} from '../services/shopifyService';

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
                    id
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

    await Promise.all(
      ordersData.data.orders.edges.map(order => {
        const customer = order?.node?.customer;
        const lineItem = order?.node?.lineItems?.edges?.[0]?.node;

        return notificationsRepository.createOne({
          shopDomain: ordersData.data.shop.myshopifyDomain,
          firstName: customer?.firstName,
          city: customer?.defaultAddress?.city,
          country: customer?.defaultAddress?.country,
          productId: lineItem?.product?.id,
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
    console.log(defaultData);
    return defaultData;
  } catch (error) {
    console.error('Error hrere', error);
    return;
  }
};
