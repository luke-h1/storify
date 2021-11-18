import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import ImageInput from '../components/ImageInput';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import toErrorMap from '../utils/toErrorMap';

const Register = () => {
  const [, register] = useRegisterMutation();
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
            const res = await register({
              image: values.image,
              options: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                bio: values.bio,
              },
            });
            if (res.data?.register.errors) {
              setErrors(toErrorMap(res.data.register.errors));
            }
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
                <InputField label="First Name" name="firstName" />
                <InputField label="Last Name" name="lastName" />

                <InputField label="Bio" name="bio" textarea />

                <InputField label="email" name="email" />
                <InputField label="password" name="password" />

                <ImageInput setFieldValue={setFieldValue} />

                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align="start"
                    justify="space-between"
                  >
                    {/* <Checkbox>Remember me</Checkbox> */}
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
          )}
        </Formik>
      </Stack>
    </Flex>
  );
};
export default Register;
