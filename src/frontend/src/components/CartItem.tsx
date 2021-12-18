import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';

import { Cart } from '../generated/graphql';

interface Props {
  cart: {
    __typename?: 'Cart' | undefined;
    createdAt: string;
    id: number;
    image: string;
    name: string;
    price: number;
    productId: number;
    qty: number;
  };
}

const CartItem = ({ cart }: Props) => {
  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        {cart.createdAt && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="red.200"
          />
        )}

        <Image
          src={cart.image}
          alt={`Picture of ${cart.name}`}
          roundedTop="lg"
        />

        <Box p="6">
          <Box d="flex" alignItems="baseline">
            {cart.createdAt && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box>
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {cart.name}
            </Box>
            <Tooltip
              label="Add to cart"
              bg="white"
              placement="top"
              color="gray.800"
              fontSize="1.2em"
            >
              <chakra.a href="#" display="flex">
                <Icon as={FiShoppingCart} h={7} w={7} alignSelf="center" />
              </chakra.a>
            </Tooltip>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
              <Box as="span" color="gray.600" fontSize="lg">
                £
              </Box>
              {cart.price.toFixed(2)}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default CartItem;
