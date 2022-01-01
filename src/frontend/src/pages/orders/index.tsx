import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Page from '../../components/Page';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage: NextPage = () => {
  const [{ data }] = useOrdersQuery({
    pause: isServer(),
  });

  return (
    <Page title="Orders Page | Storify" description="orders page">
      <h1>Orders</h1>
      <h2>These are your orders</h2>
      {/* {data?.orders && data?.orders.map((order) => (
        <div key={order.id}>
        </div>
      ))} */}
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
