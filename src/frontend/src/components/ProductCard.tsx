import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  HStack,
  Tag,
  WrapItem,
  SpaceProps,
} from '@chakra-ui/react';
import React from 'react';
import { Product } from '../generated/graphql';

interface IBlogTags {
  tags: string[];
  marginTop?: SpaceProps['marginTop'];
}

const BlogTags: React.FC<IBlogTags> = ({ tags, marginTop }) => {
  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map(tag => {
        return (
          <Tag size="md" variant="solid" colorScheme="orange" key={tag}>
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};

interface BlogAuthorProps {
  date: Date;
  name: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = ({ name, date }) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${name}`}
      />
      <Text fontWeight="medium">{name}</Text>
      <Text>—</Text>
      <Text>{date.toLocaleDateString()}</Text>
    </HStack>
  );
};

interface Props {
  product: {
    __typename?: 'Product' | undefined;
    id: number;
    brand: string;
    category: string;
    descriptionSnippet: string;
    image: string;
    name: string;
    price: number;
    creator: { __typename?: 'User' | undefined; fullName: string };
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <WrapItem width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}>
      <Box w="100%">
        <Box borderRadius="lg" overflow="hidden">
          <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
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
          </Link>
        </Box>
        <BlogTags
          tags={[`${product.brand}`, `${product.category}`]}
          marginTop="3"
        />
        <Heading fontSize="xl" marginTop="2">
          <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
            {product.name}
          </Link>
        </Heading>
        <Text as="p" fontSize="md" marginTop="2">
          {product.descriptionSnippet}
        </Text>
        <BlogAuthor
          name={product.creator.fullName}
          date={new Date('2021-04-06T19:01:27Z')}
        />
      </Box>
    </WrapItem>
  );
};

export default ProductCard;
