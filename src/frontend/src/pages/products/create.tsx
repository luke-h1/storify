import { Flex, Box, Heading, Stack, Input, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ImageInput from '../../components/ImageInput';
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
          initialValues={{
            name: '',
            image: '',
            brand: '',
            category: '',
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
              await createProduct({
                input: {
                  image: imageData.secure_url,
                  brand: values.brand,
                  category: values.category,
                  description: values.description,
                  name: values.name,
                  price: values.price,
                },
              });
            }

            // do stuff
            //   if (res.data?.register.errors) {
            //     setErrors(toErrorMap(res.data.register.errors));
            //   } else {
            //     toast.success('Succesfully registered!');
            //     setTimeout(() => {
            //       router.push('/');
            //     }, 700);
            //   }
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
                          console.log(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {/* <ImageInput
                    name="image"
                    label="image"
                    setFieldValue={setFieldValue}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //   if (e?.target?.files?.[0]) {
                    //     const file = e.target.files[0];
                    //     setFieldValue('image', file)
                    //     const reader = new FileReader();
                    //     reader.onloadend = () => {
                    //       setPreviewImage(reader.result as string);
                    //     };
                    //     reader.readAsDataURL(file);
                    //   }
                    // }}
                  /> */}
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
