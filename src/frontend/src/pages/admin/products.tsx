import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import AdminRoute from '../../components/AdminRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useProductsQuery,
  useDeleteProductAsAdminMutation,
} from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const Products = () => {
  useIsAdmin();
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });
  const [, DeleteProductAsAdmin] = useDeleteProductAsAdminMutation();

  if (!data && fetching) {
    return <Loader />;
  }

  if (!fetching && !data) {
    return <p>No products</p>;
  }

  return (
    <AdminRoute>
      <Page className="container" title="Users - Admin | Storify">
        <h1 style={{ marginBottom: '2rem' }}>Manage products on the service</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Brand</td>
              <td>Creator</td>
              <td>Image</td>
              <td>price</td>
              <td>Description</td>
              <td>Delete user</td>
            </tr>
          </thead>
          {data?.products &&
            data?.products.map(p => (
              <tbody key={p.id}>
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>
                    {p.creator.fullName} (ID: {p.creator.id})
                  </td>
                  <td>
                    <img src={p.image} alt={p.name} />{' '}
                  </td>
                  <td>£{p.price.toFixed(2)}</td>
                  <td>{p.description}</td>
                  <td>
                    <button
                      className="btn danger"
                      type="button"
                      onClick={async () => {
                        // eslint-disable-next-line no-alert
                        if (window.confirm('Are you sure?')) {
                          await DeleteProductAsAdmin({
                            id: p.id,
                            stripeProductId: p.stripeProductId,
                          });
                        }
                      }}
                    >
                      Delete product
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </Page>
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Products);
