import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage = () => {
  const [{ data, fetching }] = useOrdersQuery({ pause: isServer() });

  return <p>hello</p>;
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
