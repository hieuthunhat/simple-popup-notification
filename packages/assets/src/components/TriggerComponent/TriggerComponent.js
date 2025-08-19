/* eslint-disable react/prop-types */
import React from 'react';
import {
  BlockStack,
  Card,
  Layout,
  Select,
  TextField,
  SkeletonBodyText,
  SkeletonDisplayText
} from '@shopify/polaris';

const TriggerComponent = ({data, action, loading}) => {
  if (loading) {
    return (
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="600">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    );
  }

  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStack gap="600">
            <Select
              label="PAGES RESTRICTION"
              options={options}
              onChange={value => action('allowShow', value)}
              value={data.allowShow}
            />
            {data.allowShow === 'specific' && (
              <TextField
                label="Included pages"
                helpText="Page URLs to show the pop-up (seperated by new lines)"
                multiline={5}
                value={data.includedUrls}
                onChange={value => action('includedUrls', value)}
              />
            )}
            <TextField
              label="Excluded pages"
              helpText="Page URLs NOT to show the pop-up (seperated by new lines)"
              multiline={5}
              value={data.excludedUrls}
              onChange={value => action('excludedUrls', value)}
            />
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default TriggerComponent;
