import React, {useState} from 'react';
import {Card, Layout, Page, ResourceList} from '@shopify/polaris';
import usePaginate from '../../hooks/api/usePaginate';
import NotificationContainer from '../../components/NotificationContainer/NotificationContainer';
import useDeleteApi from '../../hooks/api/useDeleteApi';
import EmptyListDisplay from '../../components/EmptyListDisplay/EmptyListDisplay';

/**
 * Notification Page
 * @returns JSX.Element
 */
export default function Notifications() {
  const {
    data: notifications,
    loading,
    pageInfo,
    prevPage,
    nextPage,
    count,
    onQueryChange,
    setData
  } = usePaginate({
    url: '/notifications',
    defaultLimit: 25,
    initQueries: {hasCount: true},
    defaultSort: 'timestamp:desc'
  });

  const {deleting, handleDelete} = useDeleteApi({
    url: '/notifications'
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSortValue, setSelectedSortValue] = useState('timestamp:desc');

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const handleSortChange = value => {
    setSelectedSortValue(value);
    onQueryChange('sort', value, true);
  };

  const handleDeleteAction = async () => {
    setData(prevNotifications =>
      prevNotifications.filter(notification => !selectedItems.includes(notification.id))
    );
    await handleDelete({data: selectedItems});
  };

  return (
    <Page title="Notifications" subtitle="List of sales notifcation from Shopify" fullWidth>
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
              promotedBulkActions={[
                {
                  content: 'Delete all notification',
                  onAction: handleDeleteAction,
                  loading: deleting
                }
              ]}
              sortValue={selectedSortValue}
              sortOptions={[
                {label: 'Newest update', value: 'timestamp:desc'},
                {label: 'Oldest update', value: 'timestamp:asc'}
              ]}
              onSortChange={handleSortChange}
              emptyState={<EmptyListDisplay />}
            ></ResourceList>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
