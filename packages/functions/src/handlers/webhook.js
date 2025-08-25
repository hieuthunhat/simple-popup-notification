import App from 'koa';
import router from '../routes/webhook';

const webhookApi = new App();
webhookApi.proxy = true;

webhookApi.use(router.routes());
webhookApi.use(router.allowedMethods());

webhookApi.on('error', (error, ctx) => {
  console.error('Webhook error:', error);
});

export default webhookApi;
