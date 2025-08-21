const {getCurrentShopData} = require('../helpers/auth');
import * as notificationsRepository from '../repositories/notificationsRepository';

/**
 * Controller to get all notifications from Repository
 * @param {*} ctx
 */
const getAllNotifications = async ctx => {
  try {
    const shopData = getCurrentShopData(ctx);

    const {page, sort, limit, searchKey, after, before, hasCount} = ctx.query;

    const result = await notificationsRepository.getPaginated({
      shopDomain: shopData.shopifyDomain,
      page,
      sort,
      limit,
      searchKey,
      after,
      before,
      hasCount
    });

    ctx.status = 200;
    ctx.body = {success: true, ...result};
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {success: false, data: []};
  }
};

module.exports = {getAllNotifications};
