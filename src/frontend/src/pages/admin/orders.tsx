import { ButtonGroup, IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex } from '@chakra-ui/layout';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/table';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { BsBoxArrowUpRight, BsFillTrashFill } from 'react-icons/bs';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage = () => {
  const [{ data, fetching }] = useOrdersQuery({ pause: isServer() });

  const header = ['name', 'created', 'actions'];
  const fakeData = [
    { name: 'Daggy', created: '7 days ago' },
    { name: 'Anubra', created: '23 hours ago' },
    { name: 'Josef', created: 'A few seconds ago' },
    { name: 'Sage', created: 'A few hours ago' },
  ];
  return (
    <Flex w="full" p={50} alignItems="center" justifyContent="center">
      <Table
        w="full"
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
            <Th>#</Th>
            <Th>Product Title</Th>
            <Th>Price</Th>
            <Th>Qty</Th>
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
          {/* {fakeData.map((token, tid) => {
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
                          color: '#000',
                          fontSize: 'xs',
                          fontWeight: 'bold',
                          letterSpacing: 'wider',
                          fontFamily: 'heading',
                        }}
                      >
                        {x}
                      </Td>
                      <Td color="#000" fontSize="md" fontWeight="hairline">
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
                    color: '#000',
                    fontSize: 'sm',
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
                      aria-label="test"
                      colorScheme="blue"
                      icon={<BsBoxArrowUpRight />}
                    />
                    <IconButton
                      colorScheme="green"
                      icon={<AiFillEdit />}
                      aria-label="test"
                    />
                    <IconButton
                      aria-label="test"
                      colorScheme="red"
                      variant="outline"
                      icon={<BsFillTrashFill />}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })} */}
        </Tbody>
      </Table>
    </Flex>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
