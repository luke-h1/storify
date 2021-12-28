import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import {
  useMeQuery,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useProductQuery,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';

const SingleProductPage = () => {
  useIsAuth();
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
        email: user?.me?.email as string,
        firstName: user?.me?.firstName as string,
        lastName: user?.me?.lastName as string,
        productId: data.product?.id as number,
        qty: 1,
      },
    });
    if (res.data?.createOrder) {
      setTimeout(() => {
        router.push('/');
      }, 700);
      toast.success('Added to cart');
    }
  };

  return (
    <Container maxW="7xl">
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded="md"
            alt="product image"
            src={data?.product.image}
            fit="cover"
            align="center"
            w="100%"
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as="header">
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
            >
              {data?.product.name}
            </Heading>
            <Text fontWeight={300} fontSize="2xl">
              £{data?.product.price.toFixed(2)} GBP
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction="column"
            divider={<StackDivider />}
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize="2xl" fontWeight="300">
                Brand: {data?.product.brand}
              </Text>
              <Text fontSize="lg">{data?.product.description}</Text>
            </VStack>
          </Stack>

          <Button
            rounded="none"
            w="full"
            mt={8}
            size="lg"
            py="7"
            onClick={handleSubmit}
            type="submit"
            textTransform="uppercase"
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}
          >
            Add to cart
          </Button>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <MdLocalShipping />
            <Text>2-3 business days delivery</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(
  SingleProductPage,
);
