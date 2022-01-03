import {
  useStripe,
  Elements,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useOrdersQuery,
  useCreatePaymentMutation,
} from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

interface Props {
  orderId: number;
}

const CheckoutForm = ({ orderId }: Props) => {
  const stripe = useStripe();
  const [, createPayment] = useCreatePaymentMutation();
  // const stripe = useStripe();
  // const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    e.preventDefault();

    // if (elements == null) {
    //   return;
    // }

    // const res = await stripe!.createPaymentMethod({
    //   type: 'card',
    //   card: elements.getElement(CardElement) as StripeCardElement,
    // });

    // TODO: call createPayment mutation here

    const res = await createPayment({
      orderId,
    });

    if (res.data?.createPayment.stripeTransactionId) {
      stripe!.redirectToCheckout({
        sessionId: res.data?.createPayment.stripeTransactionId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="btn btn-blue mt-5">
        Pay
      </button>
    </form>
  );
};

const OrdersPage: NextPage = () => {
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  return (
    <Page title="Orders Page | Storify" description="orders page" flex={false}>
      <Elements stripe={stripePromise}>
        {fetching && !data ? (
          <Loader />
        ) : (
          <div>
            {data?.orders &&
              data?.orders.map(o => (
                <article className="p-4 rounded" key={o.id}>
                  <h1 className="text-4xl text-center mb-2">Orders</h1>
                  <h2 className="text-2xl text-center mb-5">
                    These are your orders
                  </h2>
                  <div className="flex flex-col justify-between">
                    <p className="text-gray-400">Order Status: </p>
                    <p className="font-semibold">{o.status}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-gray-400">Total cost</p>
                    <p className="font-semibold">£{o.total.toFixed(2)}</p>
                  </div>

                  {o.orderDetails &&
                    o.orderDetails.map(od => (
                      <div
                        className="flex justify-between border-solid border-2 border-light-blue-500 p-4"
                        key={od.id}
                      >
                        <img
                          src={od.product.image}
                          alt={od.product.name}
                          className="flex-none rounded-lg object-cover bg-gray-100"
                          width="120"
                          height="120"
                        />
                        <div className="flex flex-col justify-between">
                          <Link href={`/products/${od.product.id}`}>
                            <a className="text-lg font-semibold text-blue-500 hover:underline">
                              {od.product.name}
                            </a>
                          </Link>

                          <div className="flex flex-row gap-1">
                            <p className="text-gray-400">Quantity:</p>
                            <p className="font-semibold">{od.quantity}</p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between">
                          <p className="text-gray-400">Total: </p>
                          <p className="font-semibold">
                            £{od.product.price * od.quantity}
                          </p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <p className="text-gray-400">Date</p>
                          <p className="font-semibold">{od.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  <div className="">
                    <CheckoutForm orderId={o.id} />
                  </div>
                </article>
              ))}
          </div>
        )}
      </Elements>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
