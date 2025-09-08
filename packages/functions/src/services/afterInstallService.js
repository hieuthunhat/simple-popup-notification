import {getShopByShopifyDomain} from '@avada/core';
import * as shopifyService from './shopifyService';

export const install = async ctx => {
  const shopifyDomain = ctx.state.shopify.shop;
  const accessToken = ctx.state.shopify.accessToken;

  const shopData = await getShopByShopifyDomain(shopifyDomain, accessToken);

  const [ordersService, settingsService, webhookService] = await Promise.all([
    shopifyService.syncOrdersGraphQL({
      shopDomain: shopifyDomain,
      accessToken: accessToken,
      orders: 30
    }),
    shopifyService.createDefaultSettings({shopId: shopData.id, shopDomain: shopifyDomain}),
    shopifyService.registerWebhook({shopifyDomain, accessToken})
    // shopifyService.registerScriptTag({shopifyDomain, accessToken})
  ]);
  console.log('=== After Install report ===');
  console.log(ordersService);
  console.log(settingsService);
  console.log(webhookService);
};
