import { Box, Heading, Image, Text, WrapItem } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface Props {
  product: {
    __typename?: 'Product' | undefined;
    id: number;
    brand: string;
    descriptionSnippet: string;
    image: string;
    name: string;
    price: number;
    creator: { __typename?: 'User' | undefined; fullName: string };
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <WrapItem
      width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}
      padding="1rem"
    >
      <Link href={`/products/${product.id}`}>
        <a>
          <Box w="100%">
            <Box borderRadius="lg" overflow="hidden">
              <Text textDecoration="none" _hover={{ textDecoration: 'none' }}>
                <Image
                  transform="scale(1.0)"
                  src={product.image}
                  alt="some text"
                  objectFit="contain"
                  width="100%"
                  transition="0.3s ease-in-out"
                  _hover={{
                    transform: 'scale(1.05)',
                  }}
                />
              </Text>
            </Box>
            <Heading fontSize="xl" marginTop="2">
              <Text textDecoration="none" _hover={{ textDecoration: 'none' }}>
                {product.name}
              </Text>
            </Heading>
            <Text as="p" fontSize="md" marginTop="2">
              {product.descriptionSnippet}
            </Text>
            <Text as="h3" fontSize="25px">
              £{product?.price.toFixed(2)}
            </Text>
          </Box>
        </a>
      </Link>
    </WrapItem>
  );
};

export default ProductCard;
