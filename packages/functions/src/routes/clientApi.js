import Router from 'koa-router';
import * as clientController from '../controllers/clientControllers';

const clientRouterApi = () => {
  const router = new Router({prefix: '/clientApi'});

  router.get('/notifications', clientController.getClientData);

  return router;
};

export default clientRouterApi;
