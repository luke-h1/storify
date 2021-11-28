import { Box } from '@chakra-ui/react';
import React from 'react';
import Nav from './Nav';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <>
      <Nav pageProps={undefined} />
      <Box
        bg="#fff"
        mt={8}
        mx="auto"
        maxW={variant === 'regular' ? '800px' : '400px'}
        w="100%"
      >
        {children}
      </Box>
    </>
  );
};
export default Wrapper;
