import * as notificationsRepository from '../repositories/notificationsRepository.js';
import * as settingsRepository from '../repositories/settingsRepository.js';
import {presentNotification} from '../presenters/notificationPresenter.js';

/**
 *
 * @param {*} ctx
 */
export const getClientData = async ctx => {
  const {shopDomain} = ctx.query;

  try {
    const settingsData = await settingsRepository.getOneByDomain(shopDomain);

    const notificationsData = await notificationsRepository.getAll({
      shopDomain,
      limit: settingsData[0].maxPopsDisplay
    });

    const {truncateProductName, hideTimeAgo} = settingsData[0];

    const notifications = presentNotification({
      isHideTime: hideTimeAgo,
      isTruncate: truncateProductName,
      data: notificationsData
    });

    console.log(notifications);

    ctx.status = 200;
    return (ctx.body = {notifications, settings: settingsData});
  } catch (error) {
    console.error('Error getting notifications: ', error);
    ctx.status = 500;
    ctx.body = {error: 'Internal Server Error'};
  }
};
