import {
  Flex,
  Box,
  Heading,
  Stack,
  Input,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import InputField from '../../../components/InputField';
import {
  useCreateSignatureMutation,
  useUpdateProductMutation,
  useProductQuery,
} from '../../../generated/graphql';
import useGetIntId from '../../../hooks/useGetIntId';
import { useIsAuth } from '../../../hooks/useIsAuth';
import { createurqlClient } from '../../../utils/createUrqlClient';

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

const UpdateProductPage = () => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const intId = useGetIntId();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const router = useRouter();
  useIsAuth();
  const [, updateProduct] = useUpdateProductMutation();
  const [, createSignature] = useCreateSignatureMutation();

  if (!data?.product) {
    return <p>no product</p>;
  }

  return (
    <Flex align="center" justify="center" bg="#fff">
      <Stack spacing={3} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">
            Updating product: <Text color="#63B3ED">{data?.product?.name}</Text>
          </Heading>
        </Stack>
        <Formik
          initialValues={{
            name: data?.product?.name,
            image: data?.product?.image,
            brand: data?.product?.brand,
            categories: data?.product?.categories,
            description: data?.product?.description,
            price: data?.product?.price,
          }}
          onSubmit={async (values, { setErrors }) => {
            let image = data?.product?.image as unknown as string;

            // user wants to update an image
            if (values.image) {
              const { data: signatureData } = await createSignature();
              if (signatureData) {
                const { signature, timestamp } =
                  signatureData.createImageSignature;
                const imageData = await uploadImage(
                  values.image as unknown as File,
                  signature,
                  timestamp,
                );
                image = imageData.secure_url;
              }
            }
            const res = await updateProduct({
              id: intId,
              input: {
                brand: values.brand,
                categories: values.categories,
                description: values.description,
                image,
                name: values.name,
                price: values.price,
              },
            });
            if (res.data?.updateProduct) {
              toast.success(`Updated product ${values.name}`);
              router.push('/');
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
                    placeholder="category 3 "
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
                      Update product
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
  UpdateProductPage,
);
