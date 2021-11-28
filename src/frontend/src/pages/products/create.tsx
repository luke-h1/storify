import { Flex } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useCreateProductMutation } from '../../generated/graphql';
import { useIsAuth } from '../../hooks/useIsAuth';
import { createurqlClient } from '../../utils/createUrqlClient';

const CreateProductPage = () => {
  const router = useRouter();
  useIsAuth();
  const [, createProduct] = useCreateProductMutation();
  return (
    <Flex display="flex" alignItems="center" justifyContent="center">
      hello
    </Flex>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(
  CreateProductPage,
);
