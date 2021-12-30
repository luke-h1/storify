import { Box, Spinner } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import AdminRoute from '../../components/AdminRoute';
import { useUsersQuery } from '../../generated/graphql';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { createurqlClient } from '../../utils/createUrqlClient';

const Users = () => {
  const { data: adminData, fetching: adminFetching } = useIsAdmin();
  const [{ fetching, data }] = useUsersQuery();

  if (fetching) {
    return <Spinner />;
  }

  if (adminFetching && fetching && !adminData) {
    return null;
  }

  return (
    <AdminRoute>
      {data?.users?.map(u => (
        <ul key={u.id}>
          <li>FirstName: {u.firstName}</li>
          <li>lastName: {u.lastName}</li>
          <li>Email: {u.email}</li>
          <li>Created At: {u.createdAt}</li>
          <li>Updated At: {u.updatedAt}</li>
          <li>IsAdmin: {u.isAdmin}</li>
          <br />
          <hr />
          <br />
        </ul>
      ))}
    </AdminRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Users);
