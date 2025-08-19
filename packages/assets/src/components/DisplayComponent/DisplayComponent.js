/* eslint-disable react/prop-types */
import React from 'react';
import {Box, Card, Checkbox, InlineStack, RangeSlider, Text} from '@shopify/polaris';
import DesktopPositionInput from '../DesktopPositionInput/DesktopPositionInput';

const DisplayComponent = ({data, action}) => {
  return (
    <>
      <Card title="Appearance">
        <Text>Desktop Position</Text>
        <DesktopPositionInput
          value={data?.position}
          onChange={value => action('position', value)}
        />
        <Text>The display position of the pop on your website.</Text>
        <Box>
          <Checkbox
            label="Hide time ago"
            checked={data?.hideTimeAgo}
            onChange={value => action('hideTimeAgo', value)}
          />
          <Checkbox
            label="Truncate content text"
            checked={data?.truncateProductName}
            onChange={value => action('truncateProductName', value)}
            helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
          />
        </Box>
      </Card>
      <Card title="Timing" sectioned>
        <InlineStack gap="400">
          <Box style={{flex: 1}}>
            <RangeSlider
              output
              label="Display duration"
              min={0}
              max={20}
              value={data?.displayDuration}
              onChange={value => action('displayDuration', value)}
              helpText="How long each pop will display on your page."
            />
            <Box paddingBlockStart="400">
              <RangeSlider
                output
                label="Gap time between two pops"
                min={0}
                max={20}
                value={data?.popsInterval}
                onChange={value => action('popsInterval', value)}
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
              value={data?.firstDelay}
              onChange={value => action('firstDelay', value)}
              helpText="The delay time before the first notification."
            />
            <Box paddingBlockStart="400">
              <RangeSlider
                output
                label="Maxinum of popups"
                min={0}
                max={80}
                value={data?.maxPopsDisplay}
                onChange={value => action('maxPopsDisplay', value)}
                helpText="The maxinum number of popups are allowed to show after page loading. Maxinum number is 80"
              />
            </Box>
          </Box>
        </InlineStack>
      </Card>
    </>
  );
};

export default DisplayComponent;
