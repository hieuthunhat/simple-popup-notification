import Router from 'koa-router';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as settingsController from '../controllers/settingsController';
import * as notificationsController from '../controllers/notificationsController';
import * as validateSettings from '../middleware/settingsMiddleware';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);

  router.get('/notifications', notificationsController.getNotifications);
  router.delete('/notifications', notificationsController.deleteNotifications);
  router.get('/settings', settingsController.getSettings);
  router.put('/settings', validateSettings.settingsSchema, settingsController.updateSettings);

  return router;
}
