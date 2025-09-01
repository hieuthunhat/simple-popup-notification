/* eslint-disable require-jsdoc */
import makeRequest from '../helpers/api/makeRequest';
const BASE_URL = 'https://luggage-narrow-capabilities-devices.trycloudflare.com';

export default class ApiManager {
  async getNotifications() {
    return this.getApiData();
  }

  getApiData = async () => {
    const shopifyDomain = window.Shopify.shop;

    const {notifications, settings} = await makeRequest(
      `${BASE_URL}/clientApi/notifications?shopDomain=${shopifyDomain}`
    );

    return {notifications, settings};
  };
}
