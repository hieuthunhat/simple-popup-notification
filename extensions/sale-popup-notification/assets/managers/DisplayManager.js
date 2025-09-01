/* eslint-disable require-jsdoc */
import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
import React from 'preact/compat';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};
  }
  async initialize({notifications, settings}) {
    this.notifications = notifications;
    this.settings = settings[0];

    this.insertContainer();

    await this.displayNotifications(this.notifications);
  }

  async displayNotifications() {
    await this.delay(this.settings.firstDelay);
    for (const notification of this.notifications) {
      await this.displayOnePopup(notification);
      this.fadeOut();
      await this.delay(this.settings.popsInterval);
    }
  }

  async displayOnePopup(params) {
    this.display(params);
    await this.delay(this.settings.displayDuration);
  }

  async delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    render('', container);
  }

  display(notification) {
    const container = document.querySelector('#Avada-SalePop');
    console.log(this.settings.position);

    render(
      <NotificationPopup
        productImage={notification.productImage}
        firstName={notification.firstName}
        productName={notification.productName}
        city={notification.city}
        country={notification.country}
        relativeDate={notification.timestamp}
        position={this.settings.position}
      />,
      container
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;

    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) insertAfter(popupEl, targetEl);

    return popupEl;
  }
}
