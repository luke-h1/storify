import {
  Flex,
  Box,
  Heading,
  Stack,
  Input,
  Button,
  Image,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import productCreateSchema from '@storify/common/src/schemas/productCreateSchema';
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

interface IUploadImageResponse {
  // eslint-disable-next-line camelcase
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number,
): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', image);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

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
          validationSchema={productCreateSchema}
          initialValues={{
            name: '',
            image: '',
            brand: '',
            categories: [''],
            description: '',
            price: 0,
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data: signatureData } = await createSignature();
            if (signatureData) {
              const { signature, timestamp } =
                signatureData.createImageSignature;
              const imageData = await uploadImage(
                values.image as unknown as File,
                signature,
                timestamp,
              );
              const res = await createProduct({
                input: {
                  image: imageData.secure_url,
                  brand: values.brand,
                  categories: values.categories,
                  description: values.description,
                  name: values.name,
                  price: values.price,
                },
              });
              router.push(`/products/${res.data?.createProduct.id}`);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Box rounded="lg" bg="#fff" boxShadow="lg" py={8} px={8}>
                <Stack spacing={5}>
                  <InputField label="Name" name="name" placeholder="iphone" />
                  <InputField label="Brand" name="brand" placeholder="apple" />
                  <InputField
                    label="description"
                    name="description"
                    placeholder="informative description of the product"
                    textarea
                  />

                  <InputField
                    name="categories[0]"
                    placeholder="category"
                    label="category"
                  />
                  <InputField
                    name="categories[1]"
                    placeholder="category 2"
                    label="category 2"
                  />
                  <InputField
                    name="categories[2]"
                    placeholder="category 3"
                    label="category 3"
                  />
                  <InputField
                    label="Price"
                    name="price"
                    placeholder="1000"
                    type="number"
                  />

                  <Input
                    placeholder="Image"
                    type="file"
                    accept="image/*"
                    onChange={({ target: { validity, files } }) => {
                      if (validity.valid && files) {
                        setFieldValue('image', files[0]);
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {previewImage && (
                    <Box>
                      <Image
                        transform="scale(1.0)"
                        src={previewImage}
                        alt="some text"
                        objectFit="contain"
                        width="100%"
                        transition="0.3s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                      />
                    </Box>
                  )}

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
                      Create Product
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
