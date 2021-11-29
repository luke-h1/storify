import { Box } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box
      mb={8}
      bg="#fff"
      mx="auto"
      maxW={variant === 'regular' ? '1250px' : '800px'}
      w="100%"
    >
      {children}
    </Box>
  );
};
export default Wrapper;
