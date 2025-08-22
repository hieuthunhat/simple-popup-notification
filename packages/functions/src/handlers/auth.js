import App from 'koa';
import 'isomorphic-fetch';
import {contentSecurityPolicy, shopifyAuth} from '@avada/core';
import shopifyConfig from '@functions/config/shopify';
import render from 'koa-ejs';
import path from 'path';
import createErrorHandler from '@functions/middleware/errorHandler';
import firebase from 'firebase-admin';
import appConfig from '@functions/config/app';
import shopifyOptionalScopes from '@functions/config/shopifyOptionalScopes';
import {syncOrdersGraphQL} from '../services/getSyncOrders';
import {Firestore} from '@google-cloud/firestore';

if (firebase.apps.length === 0) {
  firebase.initializeApp();
}

// Initialize all demand configuration for an application
const app = new App();
app.proxy = true;

render(app, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
app.use(createErrorHandler());
app.use(contentSecurityPolicy(true));

// Register all routes for the application
app.use(
  shopifyAuth({
    apiKey: shopifyConfig.apiKey,
    accessTokenKey: shopifyConfig.accessTokenKey,
    firebaseApiKey: shopifyConfig.firebaseApiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    successRedirect: '/embed',
    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    },
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    afterThemePublish: ctx => {
      // Publish assets when theme is published or changed here
      return (ctx.body = {
        success: true
      });
    },
    optionalScopes: shopifyOptionalScopes,
    afterInstall: async ctx => {
      const shop = ctx.state.shopify.shop;
      const accessToken = ctx.state.shopify.accessToken;

      await syncOrdersGraphQL({
        shopDomain: shop,
        accessToken: accessToken
      });
    },
    afterUninstall: async () => {
      const firestore = new Firestore();
      const collectionRef = firestore.collection('notifications');
      const batchSize = 100;

      try {
        const deleteCollection = async () => {
          const snapshot = await collectionRef.limit(batchSize).get();

          if (snapshot.empty) {
            console.log('All documents deleted.');
            return;
          }

          const batch = firestore.batch();
          snapshot.docs.forEach(doc => batch.delete(doc.ref));

          await batch.commit();

          setImmediate(deleteCollection);
        };

        await deleteCollection();
        console.log('Collection notifications deleted completely.');
      } catch (err) {
        console.error('Error deleting collection:', err);
      }
    }
  }).routes()
);

// Handling all errors
app.on('error', err => {
  console.error(err);
});

export default app;
