import {
  Flex,
  Box,
  Stack,
  Link,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-hot-toast';
import InputField from '../../components/InputField';
import Nav from '../../components/Nav';
import { useRegisterMutation } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import toErrorMap from '../../utils/toErrorMap';

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Flex minH="100vh" align="center" justify="center" bg="#fff">
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
            firstName: '',
            lastName: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await register({
              options: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
              },
            });

            if (res.data?.register.errors) {
              setErrors(toErrorMap(res.data.register.errors));
            } else {
              toast.success('Succesfully registered!');

              setTimeout(() => {
                router.push('/');
              }, 700);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box rounded="lg" bg="#fff" boxShadow="lg" py={8} px={8}>
                <Stack spacing={5}>
                  <InputField label="First Name" name="firstName" />
                  <InputField label="Last Name" name="lastName" />

                  <InputField label="email" name="email" />
                  <InputField
                    label="password"
                    name="password"
                    type="password"
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
                      bg="blue.400"
                      color="white"
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Sign up
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Form>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(Register);
