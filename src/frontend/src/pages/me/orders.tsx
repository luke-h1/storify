import { withUrqlClient } from 'next-urql';
import Loader from '../../components/Loader';
import { useOrdersQuery } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const OrdersPage = () => {
  const [{ data, fetching }] = useOrdersQuery({
    pause: isServer(),
  });

  if (fetching) {
    return <Loader />;
  }

  return (
    <table style={{ marginTop: '0.5rem' }} className="table">
      <thead>
        <tr>
          <td>#</td>
          <td>Product Title</td>
          <td>Price</td>
          <td>Qty</td>
        </tr>
      </thead>
      {data?.orders &&
        data?.orders.map(o => (
          <tbody key={o.id}>
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.productTitle}</td>
              <td>{o.price}</td>
              <td>{o.qty}</td>
            </tr>
          </tbody>
        ))}
    </table>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
