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
        <h1 style={{ marginBottom: '2rem' }}>Manage users on the service</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Email</td>
              <td>Admin</td>
              <td>createdAt</td>
              <td>Make user an admin</td>
              <td>Make user a regular user</td>
              <td>Delete user</td>
            </tr>
          </thead>
          {data?.users &&
            data?.users.map(u => (
              <tbody key={u.id}>
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    {u.firstName} {u.lastName}{' '}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? 'true' : 'false'}</td>
                  <td>{u.createdAt}</td>
                  <td>
                    <button
                      className="btn danger"
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
                  <td>
                    <button
                      className="btn warning"
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
                      className="btn danger"
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
      </Page>
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Users);
