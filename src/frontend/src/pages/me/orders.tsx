import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage = () => {
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  if (fetching) {
    return <Spinner />;
  }

  return (
    <Flex>
      <UnorderedList>
        {data?.orders &&
          data?.orders.map(order => (
            <Box key={order.id}>
              <Text>TOTAL PRICE: {order.total}</Text>
              {order.orderItems.map(oi => (
                <Box key={oi.id} mb={5} mt={5}>
                  <Text>Price: {oi.price}</Text>
                  <Text>Product: {oi.productTitle}</Text>
                  <Text>QTY: {oi.qty}</Text>
                  <hr />
                  <hr />
                  <hr />
                  <hr />
                </Box>
              ))}
            </Box>
          ))}

        {/* {data?.orders &&
          data?.orders.map(o => (
            <>
            <ListItem key={o.id} mt={5}>
              <Text>Total: {o.total}</Text>
              {o.orderItems &&
                o.orderItems.map(orderItem => (
                  <Box key={orderItem.id}>
                    <Text>QTY: {orderItem.qty}</Text>
                    <Text>{orderItem.productTitle}</Text>
                    <Text mb={5}>Price: {orderItem.price}</Text>
                    <br />
                    <hr />
                    <hr />
                    <hr />
                  </Box>
                ))}
            </ListItem>
            </>
          ))} */}
      </UnorderedList>
    </Flex>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
