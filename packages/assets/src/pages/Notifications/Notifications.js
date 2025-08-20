import React, {useState} from 'react';
import {Card, Layout, Page, ResourceItem, ResourceList} from '@shopify/polaris';

import usePaginate from '../../hooks/api/usePaginate';
import NotificationContainer from '../../components/NotificationContainer/NotificationContainer';

export default function Notifications() {
  const {data: notifications, loading, pageInfo, prevPage, nextPage, count} = usePaginate({
    url: '/notifications',
    defaultLimit: 5,
    initQueries: {hasCount: true}
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };
  return (
    <Page title="Notifications" subtitle="List of sales notifcation from Shopify">
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <ResourceList
              items={notifications}
              resourceName={resourceName}
              renderItem={item => <NotificationContainer item={item} />}
              pagination={{
                hasNext: pageInfo.hasNext,
                hasPrevious: pageInfo.hasPre,
                onNext: nextPage,
                onPrevious: prevPage
              }}
              loading={loading}
              selectable
              totalItemsCount={count || notifications.length}
              showHeader={true}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            ></ResourceList>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
