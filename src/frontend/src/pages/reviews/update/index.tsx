import { Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import AuthRoute from '../../../components/AuthRoute';
import InputField from '../../../components/InputField';
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import {
  useProductQuery,
  useReviewQuery,
  useUpdateReviewMutation,
} from '../../../generated/graphql';
import { createurqlClient } from '../../../utils/createUrqlClient';
import toErrorMap from '../../../utils/toErrorMap';

const UpdateReviewPage: NextPage = () => {
  const router = useRouter();

  console.log(router.query.reviewId);

  const productId =
    typeof router.query.productId === 'string'
      ? parseInt(router.query.productId, 10)
      : -1;

  const reviewId =
    typeof router.query.reviewId === 'string'
      ? parseInt(router.query.reviewId, 10)
      : -1;

  const [{ data: productData, fetching: productFetching }] = useProductQuery({
    pause: productId === -1,
    variables: {
      id: parseInt(router.query.productId as string, 10),
    },
  });

  const [{ data: reviewData, fetching: reviewFetching }] = useReviewQuery({
    pause: productFetching || reviewId === -1,
    variables: {
      id: parseInt(router.query.reviewId as string, 10),
    },
  });

  const [, updateReview] = useUpdateReviewMutation();

  if (!productFetching && !reviewFetching && !productData?.product) {
    return <p>No product with that ID</p>;
  }

  if (productFetching || reviewFetching) {
    return <Loader />;
  }

  return (
    <Page title="update review">
      <AuthRoute>
        <Formik
          initialValues={{
            title: reviewData?.review?.title,
            rating: reviewData?.review?.rating,
            comment: reviewData?.review?.comment,
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await updateReview({
              comment: values.comment as string,
              rating: Number(values.rating),
              title: values.title as string,
              reviewId: Number(router.query.reviewId),
            });
            if (res?.data?.updateReview.errors) {
              setErrors(toErrorMap(res.data.updateReview.errors));
            } else {
              toast.success('review succesfully updated');
              router.push(`/products/${productData?.product?.id}`);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField label="title" name="title" placeholder="title" />
              <Field
                as="select"
                name="rating"
                className="form-select appearance-none
               block
               w-full
               mb-3
               px-3
               py-1.5
               text-base
               font-normal
               text-gray-700
               bg-white bg-clip-padding bg-no-repeat
               border border-solid border-gray-300
               rounded
               transition
               ease-in-out
               m-0
               focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option selected disabled>
                  Rating
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Field>
              <InputField
                label="comment"
                name="comment"
                placeholder="comment"
              />
              <button
                style={{ marginLeft: '1rem' }}
                disabled={isSubmitting || productFetching || reviewFetching}
                className="btn btn-blue"
                type="submit"
              >
                {isSubmitting ? 'submitting..' : 'Update Review'}
              </button>
            </Form>
          )}
        </Formik>
      </AuthRoute>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  UpdateReviewPage,
);
