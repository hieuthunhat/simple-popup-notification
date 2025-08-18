/* eslint-disable react/prop-types */
import {Box, Layout, LegacyCard, Select, TextField} from '@shopify/polaris';
import React from 'react';

const TriggerComponent = ({data, action}) => {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];
  return (
    <Box padding="400">
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
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
                onChange={value => action('includedUrls', value)}
              />
            )}
            <TextField
              label="Excluded pages"
              helpText="Page URLs NOT to show the pop-up (seperated by new lines)"
              multiline={5}
              onChange={value => action('excludedUrls', value)}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Box>
  );
};

export default TriggerComponent;
