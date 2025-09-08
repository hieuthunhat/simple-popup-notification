import {getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '../services/shopifyService';
import * as productsRepository from '../repositories/productsRepository';
import * as notificationsRepository from '../repositories/notificationsRepository';

export const listenNewOrder = async ctx => {
  try {
    const order = ctx.req.body;
    const shopDomain = ctx.headers['x-shopify-shop-domain'];
    const data = await getShopByShopifyDomain(shopDomain);
    const shopify = initShopify(data);

    const imageData = await productsRepository.getProductImage({
      shopName: shopDomain,
      accessToken: shopify.options.accessToken,
      productId: order.line_items[0].product_id
    });

    const checkExistedNotification = await notificationsRepository.getOne(
      order.admin_graphql_api_id
    );
    if (checkExistedNotification) {
      ctx.status = 200;
      ctx.body = {success: false, message: 'Notification already exists'};
      return;
    }

    const result = await notificationsRepository.createOne({
      shopDomain: shopDomain,
      firstName: order.billing_address.first_name,
      city: order.billing_address.city,
      country: order.billing_address.country,
      productImage: imageData.images.edges[0].node.src,
      productName: order.line_items[0].name,
      timestamp: new Date(order.created_at),
      productId: order.admin_graphql_api_id
    });
    ctx.status = 200;
    return (ctx.body = {success: true, data: result.id});
  } catch (e) {
    throw new Error('Webhook Exception: Bug here', e);
  }
};
