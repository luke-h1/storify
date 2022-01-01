import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import toast from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useCartsQuery,
  useCreateOrderMutation,
  useCreateOrderDetailsMutation,
} from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';
import toErrorMap from '../../utils/toErrorMap';

const CartPage: NextPage = () => {
  useIsAuth();
  const [{ data, fetching }] = useCartsQuery({
    pause: isServer(),
  });
  const [, createOrder] = useCreateOrderMutation();
  const [, createOrderDetails] = useCreateOrderDetailsMutation();

  if (!data && fetching) {
    return <Loader />;
  }

  return (
    <AuthRoute>
      <Page className="container" title="Cart | Storify">
        <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <tr>
              <td>product ID</td>
              <td>QTY</td>
              <td>Product name</td>
              <td>image:</td>
              <td>Total</td>
            </tr>
          </thead>
          {data?.carts &&
            data?.carts.map(c => (
              <tbody key={c.id}>
                <tr key={c.id}>
                  <td>{c.productId}</td>
                  <td>{c.quantity}</td>
                  <td>{c.product.name}</td>
                  <td>
                    <img src={c.product.image} alt={c.product.name} />
                  </td>
                  <td>{c.total}</td>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await createOrder({
                        total: c.total,
                      });

                      const orderDetails = await createOrderDetails({
                        orderId: res?.data?.createOrder?.id as number,
                        productId: c.productId,
                        quantity: c.quantity,
                      });
                      if (orderDetails.data?.createOrderDetails.errors) {
                        toErrorMap(
                          orderDetails.data?.createOrderDetails.errors,
                        );
                      } else {
                        toast.success('Succesfully created order');
                      }
                    }}
                  >
                    Finish order
                  </button>
                </tr>
              </tbody>
            ))}
        </table>
      </Page>
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(CartPage);
