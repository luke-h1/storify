import {
  Flex,
  chakra,
  Table,
  Box,
  Stack,
  Image,
  Button,
  ButtonGroup,
  Tbody,
  Td,
  Tr,
  Select,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-hot-toast';
import { BlogTags } from '../../components/ProductCard';
import {
  useProductQuery,
  useMeQuery,
  useDeleteProductMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { createurqlClient } from '../../utils/createUrqlClient';

const SingleProductPage = () => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data: user }] = useMeQuery();
  const [, deleteProduct] = useDeleteProductMutation();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (!data?.product) {
    return <p>no product</p>;
  }

  if (fetching && !data) {
    return <p>loading</p>;
  }

  const handleDelete = async () => {
    await deleteProduct({ id: data?.product?.id as number });
    toast.success('Deleted product!');
    setTimeout(() => {
      router.push('/');
    }, 700);
  };

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
        <BlogTags tags={data?.product?.categories} marginTop="3" />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          mb={{ base: 4, md: 8 }}
          mt={4}
          spacing={2}
        >
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Price</Td>
                <Td>£{data?.product.price}</Td>
              </Tr>
              <Tr>
                <Td>Qty</Td>
                <Select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Select>
              </Tr>
            </Tbody>
            <Button as="a" colorScheme="blue" mt={4}>
              Add to cart
            </Button>
          </Table>
        </Stack>
        <Box>
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
