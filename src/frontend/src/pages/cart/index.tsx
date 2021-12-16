import {
  Grid,
  GridItem,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

const CartIndexPage = () => {
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
      <GridItem colSpan={2} h="10">
        <Heading as="h1">Shopping cart</Heading>
      </GridItem>

      <GridItem colStart={4} colEnd={6} h="10" bg="papayawhip" />
    </Grid>
  );
};

export default CartIndexPage;
