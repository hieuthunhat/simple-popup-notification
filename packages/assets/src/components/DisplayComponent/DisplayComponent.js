/* eslint-disable react/prop-types */
import React from 'react';
import {
  Box,
  Checkbox,
  InlineStack,
  RangeSlider,
  Text,
  SkeletonBodyText,
  SkeletonDisplayText,
  Card,
  BlockStack
} from '@shopify/polaris';
import DesktopPositionInput from '../DesktopPositionInput/DesktopPositionInput';
import NumberDisplayField from '../NumberDisplayField/NumberDisplayField';

const DisplayComponent = ({data, action, loading = false}) => {
  if (loading) {
    return (
      <Card>
        <BlockStack>
          <SkeletonDisplayText size="small" />

          <Box paddingBlockStart="200">
            <SkeletonBodyText />
            <DesktopPositionInput />
            <SkeletonBodyText lines={4} />
          </Box>
        </BlockStack>
        <BlockStack>
          <SkeletonBodyText lines={4} />
          <InlineStack gap="400">
            <Box style={{flex: 1}}>
              <SkeletonBodyText lines={3} />
            </Box>
            <Box style={{flex: 1}}>
              <SkeletonBodyText lines={3} />
            </Box>
          </InlineStack>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack>
        <Box paddingBlock={400}>
          <Text as="h1" variant="headingMd">
            Appearance
          </Text>
        </Box>
        <Text>Desktop Position</Text>
        <DesktopPositionInput
          value={data?.position}
          onChange={value => action('position', value)}
        />
        <Text>The display position of the pop on your website.</Text>
        <Box paddingBlock={400}>
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
      </BlockStack>
      <BlockStack>
        <Box paddingBlock={400}>
          <Text as="h1" variant="headingMd">
            Timing
          </Text>
        </Box>
        <InlineStack gap="400">
          <Box style={{flex: 1}}>
            <RangeSlider
              output
              label="Display duration"
              min={0}
              max={20}
              value={data?.displayDuration}
              suffix={<NumberDisplayField value={data?.displayDuration} helpText="second(s)" />}
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
                suffix={<NumberDisplayField value={data?.popsInterval} helpText="second(s)" />}
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
              max={20}
              value={data?.firstDelay}
              suffix={<NumberDisplayField value={data?.firstDelay} helpText="second(s)" />}
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
                suffix={<NumberDisplayField value={data?.maxPopsDisplay} helpText="popup(s)" />}
                onChange={value => action('maxPopsDisplay', value)}
                helpText="The maxinum number of popups are allowed to show after page loading. Maxinum number is 80"
              />
            </Box>
          </Box>
        </InlineStack>
      </BlockStack>
    </Card>
  );
};

export default DisplayComponent;
