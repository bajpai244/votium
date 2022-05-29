/**
 * @format
 * @jsxImportSource theme-ui
 */

import { FunctionComponent } from 'react';
import { Box, Flex, Heading, Image, Paragraph } from 'theme-ui';

const Header: FunctionComponent = () => {
  return (
    <Box sx={{ pb: [5] }}>
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          pt: [5],
        }}
      >
        <Heading>Add voter</Heading>
      </Flex>
      <Paragraph sx={{ textAlign: 'center', mt: [4] }}>
        Add a new voter for your motion
      </Paragraph>
    </Box>
  );
};

export default Header;
