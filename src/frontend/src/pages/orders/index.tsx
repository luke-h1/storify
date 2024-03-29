import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useOrdersQuery,
  useCreatePaymentMutation,
  useCancelOrderMutation,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    e.preventDefault();

    const res = await createPayment({
      orderId,
    });

    if (res.data?.createPayment.stripeTransactionId) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  const router = useRouter();
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });
  const [, cancelorder] = useCancelOrderMutation();

  return (
    <Page title="Orders | Storify" description="orders" flex={false}>
      <AuthRoute>
        <Elements stripe={stripePromise}>
          {fetching && !data ? (
            <Loader />
          ) : (
            <div>
              <article className="p-4 rounded">
                <h1 className="text-4xl text-center mb-2">Orders</h1>
                <h2 className="text-2xl text-center mb-5">
                  {data?.orders && data.orders.length > 0
                    ? 'These are your orders'
                    : 'No orders created'}
                </h2>
                {data?.orders &&
                  data?.orders.map(o => (
                    <>
                      <div className="flex flex-col justify-between">
                        <p className="text-gray-400">Order Status: </p>
                        <p className="font-semibold">{o.status}</p>
                      </div>
                      <div className="flex flex-col justify-between mb-5">
                        <p className="text-gray-400">Total cost</p>
                        <p className="font-semibold">£{o.total.toFixed(2)}</p>
                      </div>
                      {o.status !== 'refunded' && o.status !== 'cancelled' && (
                        <div className="mb-5">
                          <p className="text-gray-400">Cancel Order / Refund</p>
                          <button
                            onClick={async () => {
                              const res = await cancelorder({
                                id: o.id,
                              });
                              if (res.data?.cancelorder) {
                                toast.success(
                                  'succesfully cancelled & refunded order',
                                );
                              }
                              router.reload();
                            }}
                            type="button"
                            className="btn btn-blue"
                          >
                            Cancel Order / refund
                          </button>
                        </div>
                      )}
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
                      <div>
                        {o.status !== 'completed' &&
                          o.status !== 'cancelled' &&
                          o.status !== 'refunded' && (
                            <CheckoutForm orderId={o.id} />
                          )}
                      </div>
                    </>
                  ))}
              </article>
            </div>
          )}
        </Elements>
      </AuthRoute>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
