import { Container, Heading, Divider, Wrap } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import ProductCard from '../components/ProductCard';
import { createurqlClient } from '../utils/createUrqlClient';

const Home: NextPage = () => {
  return (
    <Container maxW="7xl" p="12">
      <Heading as="h2" marginTop="5">
        Latest products
      </Heading>
      <Divider marginTop="5" />
      <Wrap spacing="30px" marginTop="5">
        test
      </Wrap>
    </Container>
  );
};

export default withUrqlClient(createurqlClient, { ssr: true })(Home);
