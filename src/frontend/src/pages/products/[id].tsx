/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import {
  Box,
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
} from '@chakra-ui/react';
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdLocalShipping } from 'react-icons/md';
import {
  useMeQuery,
  useDeleteProductMutation,
  useProductQuery,
  useChargeMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

interface Props {
  price: number;
  description: string;
  productId: number;
  firstName: string;
  lastName: string;
  email: string;
  productTitle: string;
}

const CheckoutForm = ({
  price,
  description,
  productId,
  firstName,
  lastName,
  email,
  productTitle,
}: Props) => {
  const [, charge] = useChargeMutation();

  const stripe = useStripe();

  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe!.createPaymentMethod({
      type: 'card',
      card: elements!.getElement(CardElement) as StripeCardElement,
    });

    const res = await charge({
      options: {
        amount: price,
        id: paymentMethod?.id as string,
        email,
        firstName,
        lastName,
        productId,
        productTitle,
        description,
      },
    });

    if (error) {
      toast.error(`Payment failed: ${error.message}`);
    } else {
      toast.success('You bought this item');
    }
    if (res.data?.charge) {
      router.push('/me/orders');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>price: £{price} GBP</h2>
      <CardElement />
      <br />
      <Button colorScheme="blue" disabled={!stripe} mb={10} type="submit">
        Pay
      </Button>
    </form>
  );
};

const SingleProductPage = () => {
  useIsAuth();
  // const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const intId = useGetIntId();
  const [{ data: user }] = useMeQuery();
  const [, deleteProduct] = useDeleteProductMutation();
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
    await deleteProduct({
      id: data?.product?.id as number,
      stripeProductId: data?.product?.stripeProductId as string,
    });
    toast.success('Deleted product!');
    setTimeout(() => {
      router.push('/');
    }, 700);
  };

  return (
    <Elements stripe={stripePromise}>
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
            {user?.me?.id === data?.product.creator.id && (
              <Box display="flex" flexDirection="column" maxW="50%">
                <Button
                  mb={2}
                  colorScheme="green"
                  onClick={() => {
                    router.push(`/products/update/${data?.product?.id}`);
                  }}
                >
                  Update product
                </Button>
                <Button colorScheme="red" onClick={handleDelete}>
                  Delete Product
                </Button>
              </Box>
            )}
            <Button
              rounded="none"
              w="full"
              mt={8}
              size="lg"
              py="7"
              onClick={() => setShowForm(true)}
              type="submit"
              textTransform="uppercase"
              _hover={{
                transform: 'translateY(2px)',
                boxShadow: 'lg',
              }}
            >
              Buy Now
            </Button>

            <Stack direction="row" alignItems="center" justifyContent="center">
              <MdLocalShipping />
              <Text>2-3 business days delivery</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
      {showForm && (
        <CheckoutForm
          price={data?.product.price}
          description={data?.product.description}
          productId={data?.product.id}
          email={user?.me?.email as string}
          firstName={user?.me?.firstName as string}
          lastName={user?.me?.lastName as string}
          productTitle={data?.product.name}
        />
      )}
    </Elements>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(
  SingleProductPage,
);
