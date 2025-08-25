import * as notificationsRepository from '../repositories/notificationsRepository';

export const listenNewOrder = async ctx => {
  try {
    const order = ctx.req.body;
    const shopDomain = ctx.headers['x-shopify-shop-domain'];

    const checkExistedNotification = await notificationsRepository.getOne(
      order.admin_graphql_api_id
    );
    if (checkExistedNotification) {
      console.log('Notification already exists for this order:', order.admin_graphql_api_id);
      ctx.status = 200;
      ctx.body = {success: false, message: 'Notification already exists'};
      return;
    }

    const result = await notificationsRepository.createOne({
      shopDomain: shopDomain,
      firstName: order.billing_address.first_name,
      city: order.billing_address.city,
      country: order.billing_address.country,
      productImage: '', // currently unavailable
      productName: order.line_items[0].name,
      timestamp: order.created_at,
      productId: order.admin_graphql_api_id
    });
    if (!result.id) {
      ctx.status = 400;
      ctx.body = {success: false, data: []};
    }
    ctx.status = 200;
    ctx.body = {success: true, data: result.id};
  } catch (error) {
    console.log(error);

    ctx.status = 500;
  }
};
