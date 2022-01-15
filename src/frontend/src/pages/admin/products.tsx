import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import toast from 'react-hot-toast';
import AdminRoute from '../../components/AdminRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useDeleteProductAsAdminMutation,
  useProductsAsAdminQuery,
} from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const Products: NextPage = () => {
  useIsAdmin();
  const [{ data, fetching }] = useProductsAsAdminQuery({
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
      <Page title="Products (admin) | Storify">
        <div className="bg-white p-8 rounded-md w-full max-w-800">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-gray-600 font-semibold">
                Manage products on the service
              </h2>
            </div>
          </div>
          <div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Creator
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Creator ID
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Delete Product
                      </th>
                    </tr>
                  </thead>
                  {data?.productsAsAdmin &&
                    data?.productsAsAdmin.map(p => (
                      <tbody key={p.id}>
                        <tr>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.id}
                            </p>
                          </td>{' '}
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.name}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.brand}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.creator.fullName}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.creator.id}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              <img
                                src={p.image}
                                style={{ maxWidth: '100px' }}
                                alt={p.name}
                              />
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              £{p.price.toFixed(2)}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {p.description}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              className="btn btn-red"
                              type="button"
                              onClick={async () => {
                                const res = await DeleteProductAsAdmin({
                                  id: p.id,
                                  stripeProductId: p.stripeProductId,
                                });
                                if (res.data?.deleteProductAsAdmin) {
                                  toast.success('Deleted product succesfully');
                                }
                              }}
                            >
                              Delete Product
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Products);
