import {getCurrentShopData, getCurrentUserInstance} from '../helpers/auth';
import {presentNotification} from '../presenters/notificationPresenter';
import * as notificationsRepository from '../repositories/notificationsRepository';
import * as settingsRepository from '../repositories/settingsRepository';

/**
 * Controller to get all notifications from Repository
 * @param {*} ctx
 */
const getNotifications = async ctx => {
  try {
    const shopData = getCurrentShopData(ctx);
    const {shopID} = getCurrentUserInstance(ctx);
    const {page, sort, limit, searchKey, after, before, hasCount} = ctx.query;

    const [settings, result] = await Promise.all([
      settingsRepository.getOneById(shopID),
      notificationsRepository.getPaginated({
        page,
        sort,
        limit,
        searchKey,
        after,
        before,
        hasCount,
        shopDomain: shopData.shopifyDomain
      })
    ]);

    const {truncateProductName, hideTimeAgo} = settings[0];

    const notifications = presentNotification({
      isHideTime: hideTimeAgo,
      isTruncate: truncateProductName,
      data: result.data
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: notifications,
      pageInfo: result.pageInfo,
      count: result.count,
      total: result.total
    };
  } catch (error) {
    console.error(error);

    ctx.status = 500;
    ctx.body = {success: false, data: []};
  }
};

const deleteNotifications = async ctx => {
  try {
    const notificationsList = ctx.req.body;
    for (const notifcationId of notificationsList) {
      await notificationsRepository.deleteOne({id: notifcationId});
    }
    ctx.status = 200;
    return (ctx.body = {success: true});
  } catch (error) {
    ctx.status = 500;
    ctx.body = {success: false};
  }
};

module.exports = {getNotifications, deleteNotifications};
