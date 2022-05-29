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
        <Heading>NFT DA0 🐵</Heading>
      </Flex>
      <Paragraph sx={{ textAlign: 'center', mt: [4] }}>
        The best DAO to buy NFTs with
      </Paragraph>
    </Box>
  );
};

export default Header;
