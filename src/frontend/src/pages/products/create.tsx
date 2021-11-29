import { Flex, Box, Heading, Stack, Input, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import {
  useCreateProductMutation,
  useCreateSignatureMutation,
} from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';

const CreateProductPage = () => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const router = useRouter();
  useIsAuth();
  const [, createProduct] = useCreateProductMutation();
  const [, createSignature] = useCreateSignatureMutation();
  return (
    <Flex align="center" justify="center" bg="#fff">
      <Stack spacing={3} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Create a new product</Heading>
        </Stack>
        <Formik
          initialValues={{
            name: '',
            image: '',
            brand: '',
            categoriy: '',
            description: '',
            price: 0,
          }}
          onSubmit={async (values, { setErrors }) => {
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Box rounded="lg" bg="#fff" boxShadow="lg" py={8} px={8}>
                <Stack spacing={5}>
                  <InputField label="Name" name="name" placeholder="iphone" />
                  <InputField label="Brand" name="brand" placeholder="apple" />
                  <InputField
                    label="Category"
                    name="category"
                    placeholder="tech"
                  />

                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={({ target: { validity, files } }) => {
                      if (validity.valid && files) {
                        setFieldValue('image', files[0]);
                      }
                    }}
                  />

                  <InputField label="Price" name="price" placeholder="1000" />

                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align="start"
                      justify="space-between"
                    />
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
export default withUrqlClient(createurqlClient, { ssr: false })(
  CreateProductPage,
);
