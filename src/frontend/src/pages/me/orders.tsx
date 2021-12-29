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
      <Box mb={10}>
        <Text>Finish Order</Text>
      </Box>
    </Box>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
