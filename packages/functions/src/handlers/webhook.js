import App from 'koa';
import router from '../routes/webhook';
import {verifyRequest} from '@avada/core';

const webhookApi = new App();
webhookApi.proxy = true;

webhookApi.use(router.routes());
webhookApi.use(router.allowedMethods());
webhookApi.use(verifyRequest());
// webhookApi.use(verify)

webhookApi.on('error', (error, ctx) => {
  console.error('Webhook error:', error);
});

export default webhookApi;
