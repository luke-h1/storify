import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage: NextPage = () => {
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  return (
    <Page title="Orders Page | Storify" description="orders page">
      <h1>Orders</h1>
      <h2>These are your orders</h2>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
