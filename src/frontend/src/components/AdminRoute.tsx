import { useMeQuery } from '../generated/graphql';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

const AdminRoute = ({ children }: Props) => {
  const [{ data, fetching }] = useMeQuery();

  if (!fetching && !data?.me?.isAdmin) {
    return <p>Forbidden</p>;
  }

  return children;
};
export default AdminRoute;
