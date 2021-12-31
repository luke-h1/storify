import productCreateSchema from '@storify/common/src/schemas/productCreateSchema';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import InputField from '../../components/InputField';
import {
  useCreateProductMutation,
  useCreateSignatureMutation,
} from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import styles from '../../styles/forms.module.scss';
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

interface FormValues {
  name: string;
  image: string;
  brand: string;
  description: string;
  price: number;
}

const CreateProductPage = () => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const router = useRouter();
  useIsAuth();
  const [, createProduct] = useCreateProductMutation();
  const [, createSignature] = useCreateSignatureMutation();
  return (
    <AuthRoute>
      <div className={styles.container}>
        <Formik<FormValues>
          validationSchema={productCreateSchema}
          initialValues={{
            name: '',
            image: '',
            brand: '',
            description: '',
            price: 0,
          }}
          onSubmit={async values => {
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
                  description: values.description,
                  name: values.name,
                  price: values.price,
                },
              });
              if (res?.data?.createProduct) {
                toast.success('Created product');
                router.push(`/products/${res.data?.createProduct.id}`);
              }
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className={styles.form}>
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
                disabled={isSubmitting}
                className="btn success"
                type="submit"
              >
                {isSubmitting ? 'submitting..' : 'Add product'}
              </button>
              {previewImage && (
                <img src={previewImage} alt="some text" width="100%" />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  CreateProductPage,
);
