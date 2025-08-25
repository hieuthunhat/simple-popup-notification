import {Box, Text} from '@shopify/polaris';
import React from 'react';

const EmptyListDisplay = () => {
  return (
    <Box as="div" padding={200}>
      <Text alignment="center">Nothing to show here, try reloading the page?</Text>
    </Box>
  );
};

export default EmptyListDisplay;
