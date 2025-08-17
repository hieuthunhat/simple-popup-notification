import React, {useCallback, useState} from 'react';
import {Box, Checkbox, InlineStack, Layout, LegacyCard, RangeSlider, Text} from '@shopify/polaris';
import DesktopPositionInput from '../DesktopPositionInput/DesktopPositionInput';
const DisplayComponent = () => {
  const [rangeValue, setRangeValue] = useState(0);

  const handleRangeSliderChange = useCallback(value => setRangeValue(value), []);
  return (
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
                  min={0}
                  max={20}
                  value={rangeValue}
                  onChange={handleRangeSliderChange}
                  helpText="How long each pop will display on your page."
                />
                <Box paddingBlockStart="400">
                  <RangeSlider
                    output
                    label="Gap time between two pops"
                    min={0}
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
                  min={0}
                  max={100}
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
};

export default DisplayComponent;
