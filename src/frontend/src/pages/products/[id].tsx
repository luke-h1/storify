import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex, chakra, Box, Stack, Image } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { BlogTags } from '../../components/ProductCard';
import { useProductQuery } from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { createurqlClient } from '../../utils/createUrqlClient';

const SingleProductPage = () => {
  const intId = useGetIntId();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (!data?.product) {
    return <p>no product</p>;
  }
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      // bg={useColorModeValue("brand.500")}
      px={8}
      py={24}
      mx="auto"
    >
      <Box
        w={{ base: 'full', md: 11 / 12, xl: 9 / 12 }}
        mx="auto"
        pr={{ md: 20 }}
      >
        <chakra.h2
          fontSize={{ base: '3xl', sm: '4xl' }}
          fontWeight="extrabold"
          lineHeight="shorter"
          color="#000"
          mb={6}
        >
          <chakra.span display="block">{data?.product.name}</chakra.span>
          <chakra.span display="block" color="#000">
            £{data?.product.price}
          </chakra.span>
        </chakra.h2>
        <chakra.p mb={6} fontSize={{ base: 'lg', md: 'xl' }} color="#000">
          {data?.product.description}
        </chakra.p>
        <BlogTags tags={data?.product?.categories} marginTop="3" />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          mb={{ base: 4, md: 8 }}
          mt={4}
          spacing={2}
        >
          <Box display="inline-flex" rounded="md" shadow="md">
            <chakra.a
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              px={5}
              py={3}
              border="solid transparent"
              fontWeight="bold"
              w="full"
              rounded="md"
              color="#000"
              bg="#68D391"
            >
              Buy
            </chakra.a>
          </Box>
        </Stack>
      </Box>
      <Box w={{ base: 'full', md: 10 / 12 }} mx="auto" textAlign="center">
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src={data?.product.image}
          alt={data?.product.name}
        />
      </Box>
    </Flex>
  );
};
// export default SingleProductPage;
export default withUrqlClient(createurqlClient, { ssr: true })(
  SingleProductPage,
);
