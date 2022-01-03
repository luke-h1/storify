import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from 'src/frontend/src/components/Loader';
import Page from 'src/frontend/src/components/Page';
import { useUpdateOrderStatusMutation } from 'src/frontend/src/generated/graphql';
import { createurqlClient } from 'src/frontend/src/utils/createUrqlClient';
// cs_test_b1K2XXyJ19Ge6zV6EWZdhFlDoPzNfZtPssRUp8TQTR11zSBTidYO9rk46E
const SuccessPage: NextPage = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const router = useRouter();
  const [, updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    console.log(router.query.source);
    const updateOrder = async () => {
      setLoading(true);
      const res = await updateOrderStatus({
        paymentId:
          typeof router.query.source === 'string' ? router.query.source : '',
      });
      if (res.data?.updateOrderStatus.id) {
        setLoading(false);
      }
    };
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
