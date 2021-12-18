import { Box, Button, Text, Grid, GridItem } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useCartsQuery } from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const CartIndexPage = () => {
  useIsAuth();
  const [{ data }] = useCartsQuery({
    pause: isServer(),
  });
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={2}>
      <GridItem colSpan={2} h="10">
        {data?.carts &&
          data.carts.map(cart => (
            <Box key={cart.id} mb={10}>
              <p>{cart.name}</p>
              <p>Price: £{cart.price.toFixed(2)}</p>
              <p>Product ID: {cart.productId}</p>
              <p>QTY: {cart.qty}</p>
              <Button mt={4}>Remove from cart</Button>
            </Box>
          ))}
      </GridItem>
      <GridItem colStart={4} colEnd={6} h="10">
        <Box>
          <Text as="h1" fontSize="30px">
            Subtotal ({data?.carts.length}) items
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default withUrqlClient(createurqlClient, { ssr: true })(CartIndexPage);
