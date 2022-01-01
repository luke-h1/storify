import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import classnames from 'classnames';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import Loader from '../../components/Loader';
import {
  useMeQuery,
  useDeleteProductMutation,
  useProductQuery,
  useCreateCartMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import styles from './product.module.scss';

const SingleProductPage: NextPage = () => {
  const router = useRouter();
  useIsAuth();
  const [, createCart] = useCreateCartMutation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const intId = useGetIntId();
  const [{ data: user }] = useMeQuery();
  const [, deleteProduct] = useDeleteProductMutation();
  const [{ data, fetching }] = useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
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
    <AuthRoute>
      <div className={classnames(styles.wrap, 'container')}>
        <h2>
          {data?.product?.name} - £{data?.product?.price}
        </h2>
        <img src={data?.product?.image} alt={data?.product?.name} />
        <button
          onClick={async () => {
            const result = await createCart({
              productId: data?.product?.id as number,
              quantity: 1,
            });
            if (result.data?.createCart) {
              toast.success('Added to cart');
              router.push('/');
            }
          }}
          type="button"
          className="btn"
        >
          Add to cart
        </button>

        {user?.me?.id === data?.product?.creator.id && (
          <div className="flex">
            <button onClick={handleDelete} type="button" className="btn danger">
              Delete Product
            </button>
            <button
              onClick={() => {
                router.push(`/products/update/${data?.product?.id}`);
              }}
              type="button"
              className="btn success"
            >
              Update Product
            </button>
          </div>
        )}
      </div>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  SingleProductPage,
);
