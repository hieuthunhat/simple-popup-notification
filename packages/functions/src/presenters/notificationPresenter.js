import moment from 'moment';

// split into presenter and helper as they may not relate to each other
export const presentNotification = ({data, isHideTime = false, isTruncate = false}) => {
  const newData = data.map(notification => {
    if (isTruncate && notification.productName.length > 30) {
      notification.productName = notification.productName.substring(0, 30) + '...';
    }
    if (!isHideTime) {
      notification.timeAgo = moment(notification.timestamp).fromNow();
    }
    notification.timestamp = moment(notification.timestamp).format('D MMMM YYYY');
    return notification;
  });
  return newData;
};

export const prepareNotification = ({data, shopDomain}) => {
  return data.map(({node}) => {
    const lineItem = node?.lineItems?.edges?.[0]?.node;

    return {
      shopDomain: shopDomain || '',
      firstName: node?.customer?.firstName || '',
      city: node?.customer?.defaultAddress?.city || '',
      country: node?.customer?.defaultAddress?.country || '',
      productId: lineItem?.id || '',
      productImage: lineItem?.product?.media?.nodes?.[0]?.preview?.image?.url || '',
      productName: lineItem?.title || '',
      timestamp: node?.createdAt || ''
    };
  });
};
