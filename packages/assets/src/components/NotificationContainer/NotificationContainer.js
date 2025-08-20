/* eslint-disable react/prop-types */
import React from 'react';
import {InlineStack, ResourceItem, Text} from '@shopify/polaris';
import NotificationPopup from '../NotificationPopup/NotificationPopup';
import moment from 'moment';

const NotificationContainer = ({item}) => {
  console.log('timestamp', item.timestamp);

  return (
    <ResourceItem id={item.id} accessibilityLabel={`Select notification ${item.productId}`}>
      <InlineStack align="space-between">
        <NotificationPopup {...item} />
        <Text>From {moment(item.timestamp).format('MMMM D, YYYY')}</Text>
      </InlineStack>
    </ResourceItem>
  );
};

export default NotificationContainer;
