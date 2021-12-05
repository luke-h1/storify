import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex } from '@chakra-ui/layout';
import {
  ButtonGroup,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
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
    <Flex
      w="full"
      bg="gray.600"
      p={50}
      alignItems="center"
      justifyContent="center"
    >
      <Table
        w="full"
        // bg={useColorModeValue('white', 'gray.800')}
        display={{
          base: 'block',
          md: 'table',
        }}
        sx={{
          '@media print': {
            display: 'table',
          },
        }}
      >
        <Thead
          display={{
            base: 'none',
            md: 'table-header-group',
          }}
          sx={{
            '@media print': {
              display: 'table-header-group',
            },
          }}
        >
          <Tr>
            {data?.orders.map(order => (
              <Th key={order.firstName}>{order.firstName}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody
          display={{
            base: 'block',
            lg: 'table-row-group',
          }}
          sx={{
            '@media print': {
              display: 'table-row-group',
            },
          }}
        >
          {data.map((token, tid) => {
            return (
              <Tr
                key={tid}
                display={{
                  base: 'grid',
                  md: 'table-row',
                }}
                sx={{
                  '@media print': {
                    display: 'table-row',
                  },
                  gridTemplateColumns: 'minmax(0px, 35%) minmax(0px, 65%)',
                  gridGap: '10px',
                }}
              >
                {Object.keys(token).map(x => {
                  return (
                    <React.Fragment key={`${tid}${x}`}>
                      <Td
                        display={{
                          base: 'table-cell',
                          md: 'none',
                        }}
                        sx={{
                          '@media print': {
                            display: 'none',
                          },
                          textTransform: 'uppercase',
                          // color: useColorModeValue('gray.400', 'gray.400'),
                          fontSize: 'xs',
                          fontWeight: 'bold',
                          letterSpacing: 'wider',
                          fontFamily: 'heading',
                        }}
                      >
                        {x}
                      </Td>
                      <Td
                        // color={useColorModeValue('gray.500')}
                        fontSize="md"
                        fontWeight="hairline"
                      >
                        {token[x]}
                      </Td>
                    </React.Fragment>
                  );
                })}
                <Td
                  display={{
                    base: 'table-cell',
                    md: 'none',
                  }}
                  sx={{
                    '@media print': {
                      display: 'none',
                    },
                    textTransform: 'uppercase',
                    // color: useColorModeValue('gray.400', 'gray.400'),
                    fontSize: 'xs',
                    fontWeight: 'bold',
                    letterSpacing: 'wider',
                    fontFamily: 'heading',
                  }}
                >
                  Actions
                </Td>
                <Td>
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <IconButton
                      colorScheme="blue"
                      icon={<BsBoxArrowUpRight />}
                    />
                    <IconButton colorScheme="green" icon={<AiFillEdit />} />
                    <IconButton
                      colorScheme="red"
                      variant="outline"
                      icon={<BsFillTrashFill />}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
