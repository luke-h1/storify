import productCreateSchema from '@storify/common/src/schemas/productCreateSchema';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useCreateProductMutation,
  useCreateSignatureMutation,
} from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import toErrorMap from '../../utils/toErrorMap';

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

interface FormValues {
  name: string;
  image: string;
  brand: string;
  description: string;
  price: number;
}

const CreateProductPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const router = useRouter();
  useIsAuth();
  const [, createProduct] = useCreateProductMutation();
  const [, createSignature] = useCreateSignatureMutation();
  return (
    <AuthRoute>
      <Page title="create product">
        <h1 className="text-black text-4xl mb-5">Create a new product</h1>
        <Formik<FormValues>
          validationSchema={productCreateSchema}
          initialValues={{
            name: '',
            image: '',
            brand: '',
            description: '',
            price: 0,
          }}
          onSubmit={async (values, { setErrors }) => {
            setLoading(true);
            const { data: signatureData } = await createSignature();
            if (signatureData) {
              const { signature, timestamp } =
                signatureData.createImageSignature;
              const imageData = await uploadImage(
                values.image as unknown as File,
                signature,
                timestamp,
              );
              setLoading(false);
              const res = await createProduct({
                input: {
                  image: imageData.secure_url,
                  brand: values.brand,
                  description: values.description,
                  name: values.name,
                  price: values.price,
                },
              });

              if (res?.data?.createProduct.errors) {
                setErrors(toErrorMap(res.data.createProduct.errors));
              } else {
                toast.success('Created product');
                const productId = res?.data?.createProduct?.product
                  ?.id as number;
                router.push(`/products/${productId}`);
              }
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <InputField label="Name" name="name" placeholder="iphone" />
              <InputField label="Brand" name="brand" placeholder="apple" />
              <InputField
                label="description"
                name="description"
                placeholder="informative description of the product"
              />

              <InputField
                label="Price"
                name="price"
                placeholder="1000"
                type="number"
              />

              <input
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

              <button
                style={{ marginLeft: '1rem' }}
                disabled={isSubmitting || loading}
                className="btn btn-blue"
                type="submit"
              >
                {isSubmitting ? 'submitting..' : 'Add product'}
              </button>
              {previewImage && (
                <div className="max-w-sm">
                  <img src={previewImage} alt="some text" width="100%" />
                </div>
              )}
              {isSubmitting && <Loader />}
            </Form>
          )}
        </Formik>
      </Page>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  CreateProductPage,
);
