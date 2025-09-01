/* eslint-disable react/prop-types */
import React from 'react';
import {InlineStack, ResourceItem, Text} from '@shopify/polaris';
import NotificationPopup from '../NotificationPopup/NotificationPopup';
import moment from 'moment';

const NotificationContainer = ({item}) => {
  return (
    <ResourceItem id={item.id} accessibilityLabel={`Select notification ${item.productId}`}>
      <InlineStack align="space-between">
        <NotificationPopup
          timestamp={item.timestamp ? moment(item.timestamp).fromNow() : ''}
          productName={item.productName}
          firstName={item.firstName}
          city={item.city}
          country={item.country}
          productImage={item.productImage}
        />
        {item.timestamp ? <Text>From {moment(item.timestamp).format('D MMMM YYYY')}</Text> : ''}
      </InlineStack>
    </ResourceItem>
  );
};

export default NotificationContainer;
