import reviewSchema from '@storify/common/src/schemas/reviewSchema';
import { Formik, Form, Field } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import InputField from '../../../components/InputField';
import Page from '../../../components/Page';
import {
  useProductQuery,
  useCreateReviewMutation,
} from '../../../generated/graphql';
import useGetIntId from '../../../hooks/useGetIntId';
import { createurqlClient } from '../../../utils/createUrqlClient';
import toErrorMap from '../../../utils/toErrorMap';

const ReviewCreatePage: NextPage = () => {
  const router = useRouter();
  const intId = useGetIntId();

  const [{ data }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, createReview] = useCreateReviewMutation();
  return (
    <Page title="Create Review">
      <Formik
        validationSchema={reviewSchema}
        initialValues={{
          title: '',
          rating: 0,
          comment: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const res = await createReview({
            input: {
              comment: values.comment,
              productId: data?.product?.id as number,
              rating: Number(values.rating),
              title: values.title,
            },
          });
          if (res?.data?.createReview.errors) {
            setErrors(toErrorMap(res.data.createReview.errors));
          } else {
            toast.success('Added review');
            router.push(`/products/${data?.product?.id}`);
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
            <InputField label="comment" name="comment" placeholder="comment" />
            <button
              style={{ marginLeft: '1rem' }}
              disabled={isSubmitting}
              className="btn btn-blue"
              type="submit"
            >
              {isSubmitting ? 'submitting..' : 'Add Review'}
            </button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  ReviewCreatePage,
);
