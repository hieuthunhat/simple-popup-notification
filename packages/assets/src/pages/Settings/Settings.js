import React, {useCallback, useState} from 'react';
import {
  Box,
  Card,
  Checkbox,
  InlineStack,
  Layout,
  LegacyCard,
  Page,
  RangeSlider,
  Select,
  Tabs,
  Text,
  TextField
} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import DesktopPositionInput from '../../components/DesktopPositionInput/DesktopPositionInput';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const [rangeValue, setRangeValue] = useState(0);

  const handleRangeSliderChange = useCallback(value => setRangeValue(value), []);

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

  const [pageSelected, setPageSelected] = useState('today');

  const handleSelectPageChange = useCallback(value => setPageSelected(value), []);

  const options = [
    {label: 'Today', value: 'today'},
    {label: 'Yesterday', value: 'yesterday'},
    {label: 'Last 7 days', value: 'lastWeek'}
  ];

  const renderDisplaySettings = () => (
    <Box>
      <Layout>
        <Layout.Section>
          <LegacyCard title="Appearance" sectioned>
            <Text>Desktop Position</Text>
            <DesktopPositionInput />
            <Text>The display position of the pop on your website.</Text>
            <Box>
              <Checkbox label="Hide time ago"></Checkbox>
              <Checkbox
                label="Truncate content text"
                helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
              />
            </Box>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard title="Timing" sectioned>
            <InlineStack gap="400">
              <Box style={{flex: 1}}>
                <RangeSlider
                  output
                  label="Display duration"
                  min={-20}
                  max={20}
                  value={rangeValue}
                  onChange={handleRangeSliderChange}
                  helpText="How long each pop will display on your page."
                />
                <Box paddingBlockStart="400">
                  <RangeSlider
                    output
                    label="Gap time between two pops"
                    min={-20}
                    max={20}
                    value={rangeValue}
                    onChange={handleRangeSliderChange}
                    helpText="The time interval between two popup notifications."
                  />
                </Box>
              </Box>
              <Box style={{flex: 1}}>
                <RangeSlider
                  output
                  label="Time before the first pop"
                  min={-20}
                  max={20}
                  value={rangeValue}
                  onChange={handleRangeSliderChange}
                  helpText="The delay time before the first notification."
                />
                <Box paddingBlockStart="400">
                  <RangeSlider
                    output
                    label="Maxinum of popups"
                    min={0}
                    max={80}
                    value={rangeValue}
                    onChange={handleRangeSliderChange}
                    helpText="The maxinum number of popups are allowed to show after page loading. Maxinum number is 80"
                  />
                </Box>
              </Box>
            </InlineStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Box>
  );

  const renderTriggerSettings = () => (
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
            <TextField
              label="Included pages"
              helpText="Page URLs to show the pop-up (seperated by new lines)"
              multiline={5}
            />
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
