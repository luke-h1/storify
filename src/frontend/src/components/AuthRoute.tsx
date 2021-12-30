import { useMeQuery } from '../generated/graphql';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

const AuthRoute = ({ children }: Props) => {
  const [{ data, fetching }] = useMeQuery();

  if (!fetching && !data?.me) {
    return <p>Forbidden</p>;
  }

  return children;
};
export default AuthRoute;
