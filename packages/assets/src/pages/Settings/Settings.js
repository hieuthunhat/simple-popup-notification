import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Layout, Page, Tabs} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import DisplayComponent from '../../components/DisplayComponent/DisplayComponent';
import TriggerComponent from '../../components/TriggerComponent/TriggerComponent';
import useFetchApi from '../../hooks/api/useFetchApi';
import {defaultSettings} from './DefaultSettings';
import useEditApi from '../../hooks/api/useEditApi';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {loading, data: input, setData: setInput} = useFetchApi({
    url: '/settings',
    defaultData: defaultSettings
  });
  const {editing, handleEdit} = useEditApi({
    url: '/settings',
    successMsg: 'Setting updated!',
    errorMsg: 'Failed to update'
  });
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const updateSettings = async () => {
    const result = await handleEdit(input);
    if (!result) {
      throw new Error('No update fetch');
    }
    defaultSettings = {...defaultSettings, ...input};
    console.log('settings updated: ', defaultSettings);

    console.log(result);
  };

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (input && !loading && !originalData) {
      setOriginalData(input);
    }
  }, [input, loading, originalData]);

  useEffect(() => {
    if (originalData && input) {
      const isChanged = JSON.stringify(originalData) !== JSON.stringify(input);
      setHasChanges(isChanged);
    }
  }, [input, originalData]);

  const handleChangeInput = (key, value) => {
    setInput(prev => ({...prev, [key]: value}));
  };

  const tabs = [
    {
      id: 'display-settings',
      content: 'Display',
      panelID: 'display-settings-content',
      body: DisplayComponent({data: input, action: handleChangeInput, loading: loading})
    },
    {
      id: 'trigger-settings',
      content: 'Trigger',
      panelID: 'trigger-settings-content',
      body: <TriggerComponent data={input} action={handleChangeInput} loading={loading} />
    }
  ];

  return (
    <Page
      title="Settings"
      subtitle="Decide how your notifications will display"
      primaryAction={
        <Button
          onClick={updateSettings}
          variant={hasChanges ? 'primary' : 'secondary'}
          loading={editing}
        >
          Save
        </Button>
      }
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Box>
            <NotificationPopup />
          </Box>
        </Layout.Section>
        <Layout.Section>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            {tabs[selected].body}
          </Tabs>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
