import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import AdminRoute from '../../components/AdminRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import { useOrdersQuery } from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const Orders: NextPage = () => {
  useIsAdmin();
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <Loader />;
  }

  return (
    <AdminRoute>
      <Page title="Orders (admin) | Storify">
        <h1 style={{ marginBottom: '2rem' }}>Manage orders on the service</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <td>Order ID</td>
            <td>Order Status</td>
            <td>Total</td>
            <td>User ID</td>
            <td>QTY</td>
            <td>Product ID</td>
            <td>Product Name</td>
            <td>Product image</td>
            <td>Product Price</td>
          </thead>
          {data?.orders &&
            data?.orders.map(order => (
              <tbody key={order.id}>
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>{order.total}</td>
                  <td>{order.creatorId}</td>
                  {order?.orderDetails &&
                    order?.orderDetails.map(od => (
                      <>
                        <td>{od.quantity}</td>
                        <td>{od.product.id}</td>
                        <td>{od.product.name}</td>
                        <td>{od.product.image}</td>
                        <td>{od.product.price}</td>
                      </>
                    ))}
                </tr>
              </tbody>
            ))}
        </table>
      </Page>
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Orders);
