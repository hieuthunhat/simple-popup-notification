import App from 'koa';
import clientRouterApi from '@functions/routes/clientApi';

const clientApi = new App();
clientApi.proxy = true;

const router = clientRouterApi();

clientApi.use(router.allowedMethods());
clientApi.use(router.routes());

clientApi.on('error', (error, ctx) => {
  console.error('Server: Client API error:', error);
});

export default clientApi;
