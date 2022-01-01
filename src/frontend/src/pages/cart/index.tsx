import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import toast from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
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
  const [{ data }] = useCartsQuery({
    pause: isServer(),
  });
  const [, createOrder] = useCreateOrderMutation();
  const [, createOrderDetails] = useCreateOrderDetailsMutation();

  return (
    <Page flex={false} title="Cart">
      <AuthRoute>
        <div className="bg-white p-8 rounded-md w-full max-w-800">
          <div className=" flex items-center justify-between pb-6">
            <div>
              <h2 className="text-gray-600 font-semibold">Your cart</h2>
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
                        Quantity
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>{' '}
                    </tr>
                  </thead>
                  {data?.carts &&
                    data?.carts.map(c => (
                      <tbody key={c.id}>
                        <tr>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {c.productId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {c.quantity}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {c.product.name}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <img
                              src={c.product.image}
                              alt={c.product.name}
                              className="max-w-xs"
                            />
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span
                                aria-hidden
                                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                              />
                              <span className="relative">
                                £{c.total.toFixed(2)}
                              </span>
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-blue"
                              onClick={async () => {
                                const res = await createOrder({
                                  total: c.total,
                                });

                                const orderDetails = await createOrderDetails({
                                  orderId: res?.data?.createOrder?.id as number,
                                  productId: c.productId,
                                  quantity: c.quantity,
                                });
                                if (
                                  orderDetails.data?.createOrderDetails.errors
                                ) {
                                  toErrorMap(
                                    orderDetails.data?.createOrderDetails
                                      .errors,
                                  );
                                } else {
                                  toast.success('Succesfully created order');
                                }
                              }}
                            >
                              Finish order
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
      </AuthRoute>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(CartPage);
