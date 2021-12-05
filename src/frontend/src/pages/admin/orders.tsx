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

  return <p>hello</p>;
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
