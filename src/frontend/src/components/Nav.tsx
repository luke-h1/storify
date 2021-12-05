/* eslint-disable react-hooks/rules-of-hooks */
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link as ChakraLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';

const unauthenticatedLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Products',
    slug: '/products',
  },
  {
    id: 2,
    text: 'About',
    slug: '/about',
  },
];

const authenticatedLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Dashboard',
    slug: '/dashboard',
  },
  {
    id: 2,
    text: 'Products',
    slug: '/products',
  },
  {
    id: 3,
    text: 'Profile',
    slug: '/profile',
  },
];

const adminLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Users',
    slug: 'admin/users',
  },
  {
    id: 2,
    text: 'Orders',
    slug: 'admin/orders',
  },
  {
    id: 3,
    text: 'Products',
    slug: 'admin/products',
  },
];

const Nav = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="#fff" px={4} mb={5}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Box>Logo</Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {data?.me && !data?.me.isAdmin
              ? authenticatedLinks.map(link => (
                  <ChakraLink
                    key={link.id}
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{
                      textDecoration: 'none',
                      bg: '#fff',
                    }}
                    href={link.slug}
                  >
                    {link.text}
                  </ChakraLink>
                ))
              : unauthenticatedLinks.map(link => (
                  <ChakraLink
                    key={link.id}
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{
                      textDecoration: 'none',
                      bg: useColorModeValue('gray.200', 'gray.700'),
                    }}
                    href={link.slug}
                  >
                    {link.text}
                  </ChakraLink>
                ))}
            {data?.me &&
              data?.me.isAdmin &&
              adminLinks.map(link => (
                <ChakraLink
                  key={link.id}
                  px={2}
                  py={1}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={link.slug}
                >
                  {link.text}
                </ChakraLink>
              ))}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {data?.me && <Text mr={5}>Hello {data?.me.firstName} 👋</Text>}
          {data?.me && (
            <Button
              onClick={async () => {
                await logout();
                router.reload();
              }}
              variant="solid"
              disabled={logoutFetching}
              colorScheme="teal"
              size="sm"
              type="button"
              mr={4}
            >
              Logout
            </Button>
          )}
          {!data?.me && (
            <>
              <Button
                onClick={() => router.push('/auth/login')}
                variant="solid"
                colorScheme="teal"
                size="sm"
                type="button"
                mr={4}
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
                variant="solid"
                colorScheme="blue"
                size="sm"
                type="button"
                mr={4}
              >
                Register
              </Button>
            </>
          )}
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar
                size="sm"
                src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              />
            </MenuButton>
            <MenuList>
              {data?.me && <MenuItem>Account</MenuItem>}
              <MenuDivider />
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {data?.me
              ? authenticatedLinks.map(link => (
                  <ChakraLink
                    key={link.id}
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{
                      textDecoration: 'none',
                      bg: useColorModeValue('gray.200', 'gray.700'),
                    }}
                    href={link.slug}
                  >
                    {link.text}
                  </ChakraLink>
                ))
              : unauthenticatedLinks.map(link => (
                  <ChakraLink
                    key={link.id}
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{
                      textDecoration: 'none',
                      bg: useColorModeValue('gray.200', 'gray.700'),
                    }}
                    href={link.slug}
                  >
                    {link.text}
                  </ChakraLink>
                ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(Nav);
