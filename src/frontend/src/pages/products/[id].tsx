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
  useChargeMutation,
} from '../../generated/graphql';
import useGetIntId from '../../hooks/useGetIntId';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import styles from './product.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

interface Props {
  price: number;
  description: string;
  productId: number;
  firstName: string;
  lastName: string;
  email: string;
  productTitle: string;
}

const CheckoutForm = ({
  price,
  description,
  productId,
  firstName,
  lastName,
  email,
  productTitle,
}: Props) => {
  const [, charge] = useChargeMutation();

  const stripe = useStripe();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await charge({
      options: {
        amount: price,
        description,
        productId,
        productTitle,
        firstName,
        lastName,
        email,
      },
    });
    if (res.data?.charge.transactionId) {
      stripe?.redirectToCheckout({
        sessionId: res.data?.charge.transactionId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>price: £{price} GBP</h2>
      <br />
      <button className="btn" disabled={!stripe} type="submit">
        Pay
      </button>
    </form>
  );
};

const SingleProductPage: NextPage = () => {
  const router = useRouter();
  useIsAuth();
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
      <Elements stripe={stripePromise}>
        <div className={classnames(styles.wrap, 'container')}>
          <h2>
            {data?.product?.name} - £{data?.product?.price}
          </h2>
          <img src={data?.product?.image} alt={data?.product?.name} />

          <button
            onClick={() => setShowForm(true)}
            type="button"
            className="btn"
          >
            Checkout
          </button>

          {user?.me?.id === data?.product?.creator.id && (
            <div className="flex">
              <button
                onClick={handleDelete}
                type="button"
                className="btn danger"
              >
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

          {showForm && (
            <CheckoutForm
              price={data?.product?.price as number}
              description={data?.product?.description as string}
              productId={data?.product?.id as number}
              email={user?.me?.email as string}
              firstName={user?.me?.firstName as string}
              lastName={user?.me?.lastName as string}
              productTitle={data?.product?.name as string}
            />
          )}
        </div>
      </Elements>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  SingleProductPage,
);
