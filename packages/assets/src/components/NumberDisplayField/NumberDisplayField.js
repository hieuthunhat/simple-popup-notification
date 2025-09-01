/* eslint-disable react/prop-types */
import {Box, Text} from '@shopify/polaris';
import React from 'react';

const NumberDisplayField = ({value, helpText}) => {
  return (
    <Box borderColor="border-emphasis-active" borderWidth="1px" padding="200" width="120px">
      <Text alignment="center">
        {value} {helpText}
      </Text>
    </Box>
  );
};

export default NumberDisplayField;
