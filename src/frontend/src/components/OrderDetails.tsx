import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { Order, User } from '../generated/graphql';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

interface Props {
  order: Order;
}

const OrderDetails = ({ order }: Props) => {
  const stripe = useStripe();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('hi');
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Status</p>
          <div className="flex gap-1">
            <p className="font-semibold uppercase">{order.status}</p>
            <p>at {order.createdAt}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-400">Total</p>
          <p className="font-semibold uppercase">{order.total}</p>
        </div>
        <Link href={`/orders/${order.id}`}>
          <a className="font-semibold hovver:underline cursor-pointer">
            See details
          </a>
        </Link>
        {order.status === 'created' && (
          <Elements stripe={stripePromise}>
            <form onSubmit={handleSubmit}>
              <button type="submit" disabled={!stripe}>
                Pay
              </button>
            </form>
          </Elements>
        )}
        {order.status === 'created' && (
          <button type="button">Cancel Order</button>
        )}
      </div>
    </div>
  );
};
export default OrderDetails;
