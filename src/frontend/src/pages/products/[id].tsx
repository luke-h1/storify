import { Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import ReviewCard from '../../components/ReviewCard';
import {
  useCreateCartMutation,
  useMeQuery,
  useDeleteProductMutation,
  useProductQuery,
  useReviewsQuery,
  useCreateReviewMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';
import toErrorMap from '../../utils/toErrorMap';

const SingleProductPage: NextPage = () => {
  const router = useRouter();
  const [, createCart] = useCreateCartMutation();
  const intId = useGetIntId();
  const [{ data: user }] = useMeQuery({
    pause: isServer(),
  });
  const [, deleteProduct] = useDeleteProductMutation();
  const [, createReview] = useCreateReviewMutation();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [{ data: reviewData }] = useReviewsQuery({
    pause: intId === -1,
    variables: {
      productId: data?.product?.id as number,
    },
  });

  if (fetching && !data) {
    return <Loader />;
  }
  if (!fetching && !data?.product) {
    return <p>no product</p>;
  }

  const handleDelete = async () => {
    await deleteProduct({
      id: data?.product?.id as number,
      stripeProductId: data?.product?.stripeProductId as string,
    });
    toast.success('Deleted product!');
    router.push('/');
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={data?.product?.image}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {data?.product?.brand}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {data?.product?.name}
            </h1>
            {user?.me?.id === data?.product?.creator.id && (
              <div className="flex flex-col mb-4 align-left justify-left place-items-start">
                <button
                  className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded mb-5"
                  type="button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    router.push(`/products/update/${data?.product?.id}`);
                  }}
                  className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                  type="button"
                >
                  Update
                </button>
              </div>
            )}
            <p className="leading-relaxed">{data?.product?.description}</p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-10" />
            <div className="mb-5">
              <span className="title-font font-medium text-2xl text-gray-900">
                £{data?.product?.price.toFixed(2)}
              </span>
              <button
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                type="button"
                onClick={async () => {
                  if (!user?.me) {
                    toast.error('You must be logged in to perform this action');
                    router.push('/auth/login');
                  }
                  const result = await createCart({
                    productId: data?.product?.id as number,
                    quantity: 1,
                  });
                  if (result.data?.createCart) {
                    toast.success('Added to cart');
                    router.push('/');
                  }
                }}
              >
                Add to cart
              </button>
            </div>
            <div>
              <Formik
                initialValues={{
                  title: '',
                  rating: 0,
                  comment: '',
                }}
                onSubmit={async (values, { setErrors }) => {
                  const res = await createReview({
                    comment: values.comment,
                    productId: data?.product?.id as number,
                    rating: Number(values.rating),
                    title: values.title,
                  });
                  if (res?.data?.createReview.errors) {
                    setErrors(toErrorMap(res.data.createReview.errors));
                  } else {
                    toast.success('Added review');
                    router.reload();
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <InputField
                      label="title"
                      name="title"
                      placeholder="title"
                    />
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
                      disabled={isSubmitting}
                      className="btn btn-blue"
                      type="submit"
                    >
                      {isSubmitting ? 'submitting..' : 'Add Review'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <section className="text-gray-600 body-font">
          <div className="container py-24 mx-auto">
            <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-left">
              Reviews
            </h1>
            <div>
              {reviewData &&
              reviewData.reviews &&
              reviewData.reviews.length > 0 ? (
                reviewData.reviews.map(r => (
                  <ReviewCard review={r} key={r.id} user={user} />
                ))
              ) : (
                <p>no reviews</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(
  SingleProductPage,
);
