/** @format */

import { FunctionComponent } from 'react';
import { Box, Spinner, Heading, Paragraph } from 'theme-ui';

const Loading: FunctionComponent = () => {
  return (
    <Box sx={{ textAlign: 'center', pt: [5] }}>
      <Heading>Loading 🦕</Heading>
      <Paragraph sx={{ pt: [3] }}>Tunnel is coming, are u ready 🚝 </Paragraph>
      <Spinner color="purple" sx={{ mt: [3] }} />
    </Box>
  );
};

export default Loading;
