import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
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
      {fetching && !data ? (
        <Loader />
      ) : (
        <ul className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
          {data?.orders &&
            data?.orders.map(o => (
              <article className="p-4 bg-gray-100 rounded" key={o.id}>
                {o.orderDetails &&
                  o.orderDetails.map(od => (
                    <div className="flex gap-3 justify-between" key={od.id}>
                      <div className="flex gap-3">
                        <img
                          src={od.product.image}
                          alt={od.product.name}
                          className="flex-none rounded-lg object-cover bg-gray-100"
                          width="120"
                          height="120"
                        />
                        <div className="flex flex-col justify-between">
                          <Link href={`/products/${od.product.id}`}>
                            <a className="text-lg font-semibold text-blue-500 hover:underline">
                              {od.product.name}
                            </a>
                          </Link>

                          <div className="flex flex-row gap-1">
                            <p className="text-gray-400">Quantity:</p>
                            <p className="font-semibold">{od.quantity}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-gray-400">Total</p>
                        <p className="font-semibold">
                          {od.product.price * od.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-gray-400">Created at</p>
                        <p className="font-semibold">test</p>
                      </div>
                    </div>
                  ))}
              </article>
            ))}
        </ul>
      )}
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(OrdersPage);
