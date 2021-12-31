import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

export const useIsAdmin = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me?.isAdmin) {
      router.replace('/auth/login');
    }
  }, [fetching, data, router]);
};
