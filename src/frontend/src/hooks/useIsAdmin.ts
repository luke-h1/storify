import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAdmin = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me?.isAdmin) {
      router.replace('/auth/login');
    }
  }, [fetching, data, router]);
  return {
    data,
    fetching,
  };
};
