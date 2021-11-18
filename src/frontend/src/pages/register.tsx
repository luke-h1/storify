import {
  Flex,
  Box,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import InputField from '../components/InputField';

const Register = () => {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Register today</Heading>
          <Text fontSize="lg" color="gray.600">
            to enjoy all of our cool <Link color="blue.400">features</Link> ✌️
          </Text>
        </Stack>
        <Formik
          initialValues={{
            email: '',
            password: '',
            bio: '',
            firstName: '',
            lastName: '',
            image: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            // do stuff
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Box
              rounded="lg"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow="lg"
              py={8}
              px={8}
            >
              <Stack spacing={5}>
                <InputField
                  label="First Name"
                  name="firstName"
                  placeholder="First name"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  placeholder="Last name"
                />

                <InputField label="Bio" name="bio" textarea placeholder="Bio" />

                <InputField label="email" name="email" placeholder="Email" />
                <InputField
                  label="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />

                <Input
                  placeholder="Image"
                  type="file"
                  accept="image/*"
                  onChange={({ target: { validity, files } }) => {
                    if (validity.valid && files) {
                      setFieldValue('image', files[0]);
                    }
                  }}
                />
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align="start"
                    justify="space-between"
                  >
                    <Link color="blue.400">Already a user?</Link>
                  </Stack>
                  <Button
                    as="button"
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: 'blue.500',
                    }}
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Sign up
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
};
export default Register;
