import React, {useCallback, useState} from 'react';
import {Card, InlineStack, Layout, Page, Tabs} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import DisplayComponent from '../../components/DisplayComponent/DisplayComponent';
import TriggerComponent from '../../components/TriggerComponent/TriggerComponent';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const tabs = [
    {
      id: 'display-settings',
      content: 'Display',
      panelID: 'display-settings-content'
    },
    {
      id: 'trigger-settings',
      content: 'Trigger',
      panelID: 'trigger-settings-content'
    }
  ];

  const renderDisplaySettings = () => <DisplayComponent />;

  const renderTriggerSettings = () => <TriggerComponent />;

  const renderTabContent = () => {
    switch (selected) {
      case 0:
        return renderDisplaySettings();
      case 1:
        return renderTriggerSettings();
      default:
        return null;
    }
  };

  return (
    <Page title="Settings" subtitle="Decide how your notifications will display">
      <Layout>
        <Layout.Section>
          <InlineStack gap="400" align="start" wrap={false}>
            <div style={{minWidth: '300px', maxWidth: '400px'}}>
              <Card>
                <NotificationPopup />
              </Card>
            </div>
            <div style={{flex: 1}}>
              <Card>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                  {renderTabContent()}
                </Tabs>
              </Card>
            </div>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
