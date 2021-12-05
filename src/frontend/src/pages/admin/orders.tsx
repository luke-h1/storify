import { Box, Flex, Heading } from '@chakra-ui/layout';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableCaption,
  Tfoot,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage = () => {
  const [{ data, fetching }] = useOrdersQuery({ pause: isServer() });

  if (!data && fetching) {
    return <p>fetching</p>;
  }
  return (
    <>
      <Box mb={10}>
        <Heading as="h1">Orders</Heading>
      </Box>
      {data?.orders &&
        data?.orders.map(order => (
          <Table variant="simple" key={order.id}>
            <TableCaption>Imperial to metric conversion factors</TableCaption>

            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        ))}
    </>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
