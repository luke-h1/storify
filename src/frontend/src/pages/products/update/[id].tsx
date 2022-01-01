import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthRoute from '../../../components/AuthRoute';
import InputField from '../../../components/InputField';
import Loader from '../../../components/Loader';
import {
  useCreateSignatureMutation,
  useUpdateProductMutation,
  useProductQuery,
} from '../../../generated/graphql';
import useGetIntId from '../../../hooks/useGetIntId';
import { useIsAuth } from '../../../hooks/useIsAuth';
import styles from '../../../styles/forms.module.scss';
import { createurqlClient } from '../../../utils/createUrqlClient';
import uploadImage from '../../../utils/uploadImage';

interface FormValues {
  brand: string;
  description: string;
  image: string;
  name: string;
  price: number;
}

const UpdateProductPage: NextPage = () => {
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

  if (fetching && !data) {
    return <Loader />;
  }

  if (!fetching && !data?.product?.id) {
    return <p>No product with that ID</p>;
  }

  return (
    <AuthRoute>
      <div className={styles.container}>
        <Formik<FormValues>
          initialValues={{
            name: data?.product?.name as string,
            image: data?.product?.image as string,
            brand: data?.product?.brand as string,
            description: data?.product?.description as string,
            price: data?.product?.price as number,
          }}
          onSubmit={async values => {
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
                brand: values.brand as string,
                description: values.description as string,
                stripePriceId: data?.product?.stripePriceId as string,
                image,
                name: values.name as string,
                price: values.price as number,
                stripeProductId: data?.product?.stripeProductId as string,
              },
            });
            if (res.data?.updateProduct) {
              toast.success(`Updated product ${values.name}`);
              router.push('/');
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className={styles.form}>
              <InputField label="Name" name="name" placeholder="Iphone" />
              <InputField label="Brand" name="brand" placeholder="Apple" />
              <InputField
                label="Description"
                name="description"
                placeholder="informative description of the product"
                textarea
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
              {data?.product?.image && !previewImage && (
                <img src={data?.product.image} alt="some text" width="100%" />
              )}
              {previewImage && (
                <img src={previewImage} alt="some text" width="100%" />
              )}
              <button
                style={{ marginLeft: '1rem' }}
                disabled={isSubmitting}
                className="btn success"
                type="submit"
              >
                {isSubmitting ? 'submitting..' : 'Add product'}
              </button>
              {isSubmitting && <Loader />}
            </Form>
          )}
        </Formik>
      </div>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  UpdateProductPage,
);
