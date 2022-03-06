import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthRoute from '../components/AuthRoute';
import { useDeleteMyAccountMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { createurqlClient } from '../utils/createUrqlClient';

const DeleteAccount = () => {
  const [, deleteMyAccount] = useDeleteMyAccountMutation();
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  useIsAuth();
  return (
    <AuthRoute>
      <h1 className="text-4xl text-left mb-10">Delete account</h1>
      <button
        className="btn btn-red"
        type="button"
        onClick={async () => {
          await deleteMyAccount();
          setMessage(
            'Your account has now been deleted. You will no longer be able to use the service',
          );
          setTimeout(() => {
            router.reload();
          }, 3000);
        }}
      >
        Delete my account
      </button>
      {message && <p className="2xl">{message}</p>}
    </AuthRoute>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(DeleteAccount);
