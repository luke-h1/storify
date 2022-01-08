import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AuthRoute from '../../components/AuthRoute';
import Page from '../../components/Page';
import { useUpdateOrderStatusMutation } from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';

const SuccessPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [, updateOrderStatus] = useUpdateOrderStatusMutation();
  useIsAuth();

  useEffect(() => {
    const upOrder = async () => {
      await updateOrderStatus({
        paymentId: router.query.source as string,
      });
    };
    setLoading(true);
    upOrder();
    setLoading(false);
    router.push('/orders');
    toast.success('Order completed!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Checkout Success | Storify" description="Checkout successful">
      <AuthRoute>
        {loading ? (
          <h1 className="text-4xl">Confirming your order</h1>
        ) : (
          <h1 className="text-4xl">
            Order completed. Thanks for the business!
          </h1>
        )}
      </AuthRoute>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(SuccessPage);
