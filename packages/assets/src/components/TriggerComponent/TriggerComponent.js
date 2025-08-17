import {Box, Layout, LegacyCard, Select, TextField} from '@shopify/polaris';
import React, {useCallback, useState} from 'react';

const TriggerComponent = () => {
  const [pageSelected, setPageSelected] = useState('all-pages');

  const handleSelectPageChange = useCallback(value => setPageSelected(value), []);

  const options = [
    {label: 'All pages', value: 'all-pages'},
    {label: 'Specific pages', value: 'specific-pages'}
  ];
  return (
    <Box padding="400">
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <Select
              label="PAGES RESTRICTION"
              options={options}
              onChange={handleSelectPageChange}
              value={pageSelected}
            />
            {pageSelected === 'specific-pages' && (
              <TextField
                label="Included pages"
                helpText="Page URLs to show the pop-up (seperated by new lines)"
                multiline={5}
              />
            )}
            <TextField
              label="Excluded pages"
              helpText="Page URLs NOT to show the pop-up (seperated by new lines)"
              multiline={5}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Box>
  );
};

export default TriggerComponent;
