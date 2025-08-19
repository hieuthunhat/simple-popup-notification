import React, {useState} from 'react';
import {Card, IndexTable, Layout, Page, useIndexResourceState} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';

export default function Notifications() {
  const {data: notifications, loading} = useFetchApi({url: '/samples'});

  const {selectedResources, handleSelectionChange} = useIndexResourceState(notifications);

  return (
    <Page title="Notifications" subtitle="List of sales notifcation from Shopify">
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <IndexTable
              resourceName={{singular: 'notifications', plural: 'notifications'}}
              itemCount={notifications.length}
              selectedItemsCount={selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[{title: 'Title'}]}
              loading={loading}
              pagination={{
                hasNext: true,
                onNext: () => {}
              }}
            >
              {notifications.map(({id, title}, index) => (
                <IndexTable.Row
                  id={id}
                  key={id}
                  position={index}
                  selected={selectedResources.includes(id)}
                >
                  <IndexTable.Cell>
                    <NotificationPopup />
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
