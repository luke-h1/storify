import { useProductQuery } from '../generated/graphql';
import useGetIntId from './useGetIntId';

const useGetProductFromUrl = () => {
  const intId = useGetIntId();
  return useProductQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
export default useGetProductFromUrl;
