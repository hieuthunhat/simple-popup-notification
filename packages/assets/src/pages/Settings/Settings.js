import React, {useCallback, useState} from 'react';
import {Box, Layout, Page, SkeletonBodyText, Tabs} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import DisplayComponent from '../../components/DisplayComponent/DisplayComponent';
import TriggerComponent from '../../components/TriggerComponent/TriggerComponent';
import useFetchApi from '../../hooks/api/useFetchApi';
import {defaultSettings} from '../../const/settings';
import useEditApi from '../../hooks/api/useEditApi';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {loading, data: input, handleChangeInput} = useFetchApi({
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
  };

  const tabs = [
    {
      id: 'display-settings',
      content: 'Display',
      panelID: 'display-settings-content',
      body: <DisplayComponent data={input} action={handleChangeInput} loading={loading} />
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
      primaryAction={{
        content: 'Save',
        onAction: updateSettings,
        loading: editing
      }}
      fullWidth
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Box>{loading ? <SkeletonBodyText lines={4} /> : <NotificationPopup />}</Box>
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
