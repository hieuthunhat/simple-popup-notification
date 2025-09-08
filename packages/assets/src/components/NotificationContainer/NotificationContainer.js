/* eslint-disable react/prop-types */
import React from 'react';
import {InlineStack, ResourceItem, Text} from '@shopify/polaris';
import NotificationPopup from '../NotificationPopup/NotificationPopup';

const NotificationContainer = ({item}) => {
  return (
    <ResourceItem id={item.id} accessibilityLabel={`Select notification ${item.productId}`}>
      <InlineStack align="space-between">
        <NotificationPopup
          timeAgo={item.timeAgo}
          productName={item.productName}
          firstName={item.firstName}
          city={item.city}
          country={item.country}
          productImage={item.productImage}
        />
        <Text>From {item.timestamp}</Text>
      </InlineStack>
    </ResourceItem>
  );
};

export default NotificationContainer;
