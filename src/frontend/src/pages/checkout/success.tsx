import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import { useUpdateOrderStatusMutation } from '../../generated/graphql';
// cs_test_b1K2XXyJ19Ge6zV6EWZdhFlDoPzNfZtPssRUp8TQTR11zSBTidYO9rk46E
const SuccessPage: NextPage = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const router = useRouter();
  const [, updateOrderStatus] = useUpdateOrderStatusMutation();

  const updateorder = async () => {
    setLoading(true);
    const res = await updateOrderStatus({
      paymentId:
        typeof router.query.token === 'string' ? router.query.token : '',
    });
    if (res.data?.updateOrderStatus.id) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateOrder = async () => {
      setLoading(true);
      const res = await updateOrderStatus({
        paymentId:
          typeof router.query.token === 'string' ? router.query.token : '',
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
export default SuccessPage;
