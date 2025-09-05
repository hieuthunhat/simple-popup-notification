/* eslint-disable require-jsdoc */
import React from 'preact/compat';
import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
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
      this.display(notification);
      await this.delay(this.settings.displayDuration);
      this.fadeOut();
      await this.delay(this.settings.popsInterval);
    }
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

    render(
      <NotificationPopup
        productImage={notification.productImage}
        firstName={notification.firstName}
        productName={notification.productName}
        city={notification.city}
        country={notification.country}
        timeAgo={notification.timeAgo}
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
