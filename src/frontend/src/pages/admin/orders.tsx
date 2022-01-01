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
      <Page className="container" title="Users - Admin | Storify">
        <h1 style={{ marginBottom: '2rem' }}>Manage users on the service</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Creator ID</td>
              <td>Product Title</td>
              <td>QTY</td>
              <td>Completed</td>
              <td>Price</td>
              <td>User email:</td>
            </tr>
          </thead>
          {data?.orders &&
            data?.orders.map(o => (
              <tbody key={o.id}>
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.creatorId}</td>
                  <td>{o.productTitle}</td>
                  <td>{o.qty}</td>
                  <td>{o.completed ? 'true' : 'false'}</td>
                  <td>{o.price}</td>
                  <td>{o.email}</td>
                </tr>
              </tbody>
            ))}
        </table>
      </Page>
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Orders);
