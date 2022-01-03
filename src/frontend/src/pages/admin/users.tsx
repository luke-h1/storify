/* eslint-disable no-alert */
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import AdminRoute from '../../components/AdminRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useUsersQuery,
  useDeleteUserMutation,
  useMakeUserAdminMutation,
  useMakeUserRegularUserMutation,
} from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const Users: NextPage = () => {
  const [, deleteUser] = useDeleteUserMutation();
  const [, makeUserAdmin] = useMakeUserAdminMutation();
  const [, makeUserRegularUser] = useMakeUserRegularUserMutation();
  useIsAdmin();
  const [{ data, fetching }] = useUsersQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <Loader />;
  }

  return (
    <AdminRoute>
      <Page title="Users - Admin | Storify">
        <div className="bg-white p-8 rounded-md w-full max-w-800">
          <div className=" flex items-center justify-between pb-6">
            <div>
              <h2 className="text-gray-600 font-semibold">
                Manage users on the service
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
                        ID
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        createdAt
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Make user an admin
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Make user a regular user
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Delete user
                      </th>
                    </tr>
                  </thead>
                  {data?.users &&
                    data?.users.map(u => (
                      <tbody key={u.id}>
                        <tr>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {u.id}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {u.firstName} {u.lastName}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {u.email}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {u.isAdmin ? 'true' : 'false'}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {u.createdAt}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              className="btn btn-red"
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Are you sure?')) {
                                  await makeUserAdmin({ id: u.id });
                                }
                              }}
                            >
                              Make user admin
                            </button>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              className="btn btn-red"
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Are you sure?')) {
                                  makeUserRegularUser({ id: u.id });
                                }
                              }}
                            >
                              Make user regular user
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-red"
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Are you sure?')) {
                                  await deleteUser({ id: u.id });
                                }
                              }}
                            >
                              Delete user
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
export default withUrqlClient(createurqlClient, { ssr: true })(Users);
