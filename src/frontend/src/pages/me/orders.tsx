import { Box, Spinner, Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
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
              <Tr key={o.id}>
                <Td>{o.id}</Td>
                <Td>{o.productTitle}</Td>
                <Td>{o.price}</Td>
                <Td>{o.qty}</Td>
              </Tr>
            </Tbody>
          ))}
      </Table>
    </Box>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
