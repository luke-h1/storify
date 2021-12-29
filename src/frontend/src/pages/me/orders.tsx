import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Stack,
} from '@chakra-ui/react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import InputField from '../../components/InputField';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const CheckoutForm = () => {
  const stripe = useStripe();

  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe!.createPaymentMethod({
      type: 'card',
      card: elements!.getElement(CardElement) as StripeCardElement,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>price: £10 GBP</h2>
      <CardElement />
      <br />
      <Button colorScheme="blue" disabled={!stripe} mb={10}>
        Pay
      </Button>
    </form>
  );
};

const OrdersPage = () => {
  const [complete, setComplete] = useState<boolean>(false);

  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  if (fetching) {
    return <Spinner />;
  }

  return (
    <Elements stripe={stripePromise}>
      <Box>
        <Table mb={10}>
          <Thead>
            <Tr>
              <Td>#</Td>
              <Td>Product Title</Td>
              <Td>Price</Td>
              <Td>Qty</Td>
            </Tr>
          </Thead>
          {data?.orders &&
            data?.orders.map(o => (
              <Tbody key={o.id}>
                {o.orderItems &&
                  o.orderItems.map(item => (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td>{item.productTitle}</Td>
                      <Td>{item.price}</Td>
                      <Td>{item.qty}</Td>
                    </Tr>
                  ))}
              </Tbody>
            ))}
        </Table>
        <Button mb={10} colorScheme="blue" onClick={() => setComplete(true)}>
          Complete order
        </Button>
        {complete && (
          <Box>
            <CheckoutForm />
          </Box>
        )}
      </Box>
    </Elements>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
