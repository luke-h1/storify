/* eslint-disable no-alert */
/* eslint-disable no-await-in-loop */
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import CartItem from '../../components/CartItem';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useCartsQuery,
  useCreateOrderMutation,
  useCreateOrderDetailsMutation,
  useDeleteCartMutation,
} from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const CartPage: NextPage = () => {
  const router = useRouter();
  useIsAuth();
  const [{ data, fetching }] = useCartsQuery({
    pause: isServer(),
  });
  const [, createOrder] = useCreateOrderMutation();
  const [, createOrderDetails] = useCreateOrderDetailsMutation();

  const [, deleteCart] = useDeleteCartMutation();

  return (
    <Page flex={false} title="Cart">
      <AuthRoute>
        <h1 className="text-4xl">Your cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4">
          <div className="col-span-4 shadow">
            <div>
              {!data && fetching ? (
                <Loader />
              ) : (
                data?.carts.map(c => <CartItem key={c.product.id} cart={c} />)
              )}
            </div>
            {data?.carts && data?.carts.length > 0 && (
              <div className="p-2">
                <button
                  type="button"
                  className="m-auto text-center text-red-600 cursor-pointer block px-4 py-2 rounded-md bg-red-100 hover:bg-red-200"
                  onClick={async () => {
                    if (window.confirm('Are you sure?')) {
                      await deleteCart();
                      router.reload();
                    }
                  }}
                >
                  Empty shopping cart
                </button>
              </div>
            )}
          </div>
          <div className="col-span-2 p-3 rounded shadow">
            <div className="flex flex-col justify-between h-full">
              <h2 className="text-xl font-semibold text-left">Order Summary</h2>
              <div className="flex justify-between font-semibold sm:my-6">
                <div className="flex gap-1">
                  <p className="text-gray-500 font-light">Items:</p>
                  <p>{data?.carts && data?.carts.length}</p>
                </div>
              </div>
              <div className="flex justify-between font-semibold sm:my-6">
                <p>Total Amount</p>
                <p>
                  £
                  {data?.carts.reduce((tally, cartItem) => {
                    return tally + cartItem.quantity * cartItem.product.price;
                  }, 0)}
                </p>
              </div>
              <button
                className={
                  !data?.carts.length ? 'btn bg-gray-300' : 'btn btn-blue'
                }
                type="button"
                disabled={!data?.carts.length}
                onClick={async () => {
                  const res = await createOrder({
                    total: data?.carts.reduce((tally, cartItem) => {
                      return tally + cartItem.quantity * cartItem.product.price;
                    }, 0) as number,
                  });
                  for (let i = 0; i < (data?.carts?.length as number); i += 1) {
                    await createOrderDetails({
                      orderId: res?.data?.createOrder?.id as number,
                      productId: data?.carts[i].product.id as number,
                      quantity: data?.carts[i].quantity as number,
                    });
                  }
                  toast.success('Succesfully created order!');
                  router.push('/orders');
                }}
              >
                Create order
              </button>
            </div>
          </div>
        </div>
      </AuthRoute>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(CartPage);
