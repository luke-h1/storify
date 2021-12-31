import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminRoute from '../../components/AdminRoute';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import { useUsersQuery, useDeleteUserMutation } from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const Users = () => {
  const router = useRouter();
  const [, deleteUser] = useDeleteUserMutation();
  useIsAdmin();
  const [{ data, fetching }] = useUsersQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <Loader />;
  }

  return (
    <AdminRoute>
      <Page className="container" title="Users - Admin | Storify">
        <h1>Manage users on the service</h1>
        <table style={{ marginTop: '0.5rem' }} className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Email</td>
              <td>Admin</td>
              <td>createdAt</td>
              <td>Delete user</td>
              <td>Profile</td>
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
                      className="btn"
                      type="button"
                      onClick={async () => {
                        // eslint-disable-next-line no-alert
                        if (window.confirm('Are you sure?')) {
                          await deleteUser({ id: u.id });
                          // await router.reload()
                        }
                      }}
                    >
                      Delete user
                    </button>
                  </td>
                  <td>
                    <Link href={`/admin/users/${u.id}`}>
                      <a>Profile</a>
                    </Link>
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
