import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import classnames from 'classnames';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdLocalShipping } from 'react-icons/md';
import AuthRoute from '../../components/AuthRoute';
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

const SingleProductPage = () => {
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
    return <p>loading</p>;
  }
  if (!data?.product) {
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
            {data?.product.name} - £{data?.product.price}
          </h2>
          <img src={data?.product.image} alt={data?.product.name} />

          <button
            onClick={() => setShowForm(true)}
            type="button"
            className="btn"
          >
            Checkout
          </button>
          {showForm && (
            <CheckoutForm
              price={data?.product.price}
              description={data?.product.description}
              productId={data?.product.id}
              email={user?.me?.email as string}
              firstName={user?.me?.firstName as string}
              lastName={user?.me?.lastName as string}
              productTitle={data?.product.name}
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
