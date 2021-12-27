/* eslint-disable no-shadow */
import {
  Flex,
  chakra,
  Table,
  Box,
  Image,
  Button,
  ButtonGroup,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';

import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-hot-toast';
import {
  useProductQuery,
  useMeQuery,
  useDeleteProductMutation,
  useCreateOrderMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { createurqlClient } from '../../utils/createUrqlClient';

const SingleProductPage = () => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data: user, fetching: userFetching }] = useMeQuery();
  const [, deleteProduct] = useDeleteProductMutation();
  const [, createOrder] = useCreateOrderMutation();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching && !data) {
    return <p>loading</p>;
  }
  if (!data?.product) {
    return <p>no product</p>;
  }

  if (!user && !userFetching) {
    router.push('/auth/login');
  }

  const handleDelete = async () => {
    await deleteProduct({ id: data?.product?.id as number });
    toast.success('Deleted product!');
    setTimeout(() => {
      router.push('/');
    }, 700);
  };

  const handleSubmit = async () => {
    const res = await createOrder({
      input: {
        address: 'test',
        city: 'test',
        country: 'test',
        email: 'test',
        firstName: 'test',
        lastName: 'test',
        postCode: 'test',
        productId: data.product?.id as number,
        qty: 1,
      },
    });
    if (res.data?.createOrder) {
      router.push('/');
    }
  };
  return (
    <Flex direction={{ base: 'column', md: 'row' }} px={8} py={24} mx="auto">
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
        </chakra.h2>
        <Table variant="simple" mb={4}>
          <Tbody>
            <Tr>
              <Td>Price</Td>
              <Td>£{data?.product.price}</Td>
            </Tr>
          </Tbody>
        </Table>
        <chakra.p mb={6} fontSize={{ base: 'lg', md: 'xl' }} color="#000">
          {data?.product.description}
        </chakra.p>
        <Box mb={10} />
        <Box mb={10} mt={5}>
          {data?.product.creator.id === user?.me?.id && (
            <>
              <hr />
              <ButtonGroup>
                <Link href={`/products/update/${data?.product.id}`}>
                  <a>
                    <Button colorScheme="blue" mt={4}>
                      Update product
                    </Button>
                  </a>
                </Link>
                <Button as="a" colorScheme="red" mt={4} onClick={handleDelete}>
                  Delete product
                </Button>
              </ButtonGroup>
            </>
          )}
        </Box>
        <Box mt={5} mb={10}>
          <Button
            bg="blue.400"
            color="white"
            _hover={{
              bg: 'blue.500',
            }}
            type="submit"
            onClick={handleSubmit}
          >
            Add to cart
          </Button>{' '}
        </Box>
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
export default withUrqlClient(createurqlClient, { ssr: true })(
  SingleProductPage,
);
