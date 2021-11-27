import {
  Flex,
  Box,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import InputField from '../../components/InputField';

const Login = () => {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Sign in to your account</Heading>
          <Text fontSize="lg" color="gray.600">
            to enjoy all of our cool <Link color="blue.400">features</Link> ✌️
          </Text>
        </Stack>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            // do something
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box
                rounded="lg"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow="lg"
                p={8}
              >
                <Stack spacing={4}>
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
                      {/* <Checkbox>Remember me</Checkbox> */}
                      <Link color="blue.400">Forgot password?</Link>
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
                      Sign in
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
export default Login;
