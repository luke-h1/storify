import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import { useUpdateOrderStatusMutation } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';

const SuccessPage: NextPage = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const router = useRouter();
  const [, updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    const updateOrder = async () => {
      setLoading(true);
      const res = await updateOrderStatus({
        paymentId:
          typeof router.query.source === 'string' ? router.query.source : '',
      });
      if (res.data?.updateOrderStatus) {
        setLoading(false);
      }
    };
    updateOrder();
  }, []);

  return (
    <Page title="Checkout Success | Storify" description="Checkout successful">
      <h1>payment succesful</h1>
      <p>{loading ? 'confirming your order...' : 'Order completed'}</p>
      {loading && <Loader />}
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(SuccessPage);
