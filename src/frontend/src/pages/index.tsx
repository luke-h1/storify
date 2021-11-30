import { Container, Heading, Divider, Wrap, Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import ProductCard from '../components/ProductCard';
import { useProductsQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';

const Home: NextPage = () => {
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });
  if (!data && fetching) {
    return <Spinner />;
  }
  return (
    <Container maxW="7xl" p="12">
      <Heading as="h2" marginTop="5">
        Latest products
      </Heading>
      <Divider marginTop="5" />
      <Wrap spacing="30px" marginTop="5">
        {data?.products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </Wrap>
    </Container>
  );
};

export default withUrqlClient(createurqlClient, { ssr: true })(Home);
