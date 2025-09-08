import {isEmpty} from '@avada/utils';
import appConfig from '../config/app';
import Shopify from 'shopify-api-node';
import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import {Firestore} from '@google-cloud/firestore';
import {batchCreate} from '../repositories/helper';
import {defaultSettingsData} from '../const/defaultSettings';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {prepareNotification} from '../presenters/notificationPresenter';
import * as settingsRepository from '../repositories/settingsRepository';

const {baseUrl} = appConfig;
const firestore = new Firestore();
export const API_VERSION = '2025-07';
const collection = firestore.collection('notifications');
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
export const syncOrdersGraphQL = async ({shopDomain, accessToken, limit = 30}) => {
  const shopify = new Shopify({
    accessToken: accessToken,
    shopName: shopDomain
  });

  const query = loadGraphQL('/orders.graphql');
  const ordersData = await shopify.graphql(query, {limit});
  const orders = ordersData?.orders?.edges;
  const preparedOrders = prepareNotification({data: orders, shopDomain: shopDomain});

  try {
    await batchCreate({
      firestore: firestore,
      collection: collection,
      data: preparedOrders
    });
    return {success: true};
  } catch (error) {
    throw new Error('sth wrong here');
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
    return defaultData;
  } catch (e) {
    console.error('Error hrere', e);
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
  try {
    const shopify = new Shopify({
      shopName: shopifyDomain,
      accessToken
    });

    const currentWebhooks = await shopify.webhook.list();

    const unusedHooks = currentWebhooks.filter(webhook => !webhook.address.includes(baseUrl));

    if (!isEmpty(unusedHooks)) {
      await Promise.all(
        unusedHooks.map(async hook => {
          await shopify.webhook.delete(hook.id);
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
      // console.log('Webhook created successfully:', createdWebhook);
      return createdWebhook;
    }
  } catch (e) {
    console.error('Error registering webhook:', e);
  }
};

export const registerScriptTag = async ({shopifyDomain, accessToken}) => {
  const shopify = new Shopify({
    shopName: shopifyDomain,
    accessToken
  });

  const existingScriptTags = await shopify.scriptTag.list();

  for (const tag of existingScriptTags) {
    await shopify.scriptTag.delete(tag.id);
  }

  const scriptTag = await shopify.scriptTag.create({
    event: 'onload',
    src: 'https://localhost:3001/scripttag/avada-sale-pop.min.js'
  });

  return scriptTag;
};

/**
 * Fetch product images from Shopify GraphQL API
 *
 * @async
 * @param {{ shopName: any; accessToken: any; productId: any; }} param0
 * @param {*} param0.shopName
 * @param {*} param0.accessToken
 * @param {*} param0.productId
 * @returns {unknown}
 */
export const getProductImage = async ({shopName, accessToken, productId}) => {
  const shopify = new Shopify({shopName: shopName, accessToken: accessToken});
  const productGid = `gid://shopify/Product/${productId}`;
  const query = loadGraphQL('/image.graphql');
  const imageData = await shopify.graphql(query, {id: productGid});

  if (!imageData) {
    return null;
  }

  return imageData.data.product;
};
