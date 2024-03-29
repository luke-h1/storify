import { SSRExchange } from '@urql/core/dist/types/exchanges/ssr';
import { cacheExchange, Cache } from '@urql/exchange-graphcache';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange, ClientOptions } from 'urql';
import { pipe, tap } from 'wonka';
import {
  MeDocument,
  MeQuery,
  LoginMutation,
  RegisterMutation,
  LogoutMutation,
  DeleteProductMutationVariables,
  DeleteProductAsAdminMutationVariables,
  MakeUserAdminMutationVariables,
  MakeUserRegularUserMutationVariables,
  UpdateCartQuantityMutationVariables,
  DeleteCartItemMutationVariables,
  CreateCartMutationVariables,
  DeleteReviewMutationVariables,
  DeleteUserAsAdminMutationVariables,
} from '../generated/graphql';
import { CustomUpdateQuery } from './customUpdateQuery';
import { isServer } from './isServer';

const errorExchange: Exchange =
  ({ forward }) =>
  ops$ => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (
          error?.message.includes(
            'Not authenticated' ||
              "Access denied! You don't have permission for this action!",
          )
        ) {
          Router.push('/auth/login');
        }
      }),
    );
  };

function invalidateAllProducts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'Product');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'Product', fi.arguments || {});
  });
}

function invalidateAllOrders(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'Order');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'Order', fi.arguments || {});
  });
}

function invalidateAllCarts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'Cart');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'Cart', fi.arguments || {});
  });
}

function invalidateAllReviews(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'Review');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'Review', fi.arguments || {});
  });
}
export const createurqlClient = (
  ssrExchange: SSRExchange,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
): ClientOptions => {
  let cookie = '';

  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_STORIFY_API_URL,
    fetchOptions: {
      credentials: 'include',
      headers: cookie ? { cookie } : undefined,
    },
    requestPolicy: 'cache-and-network',
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (_result, _args, cache) => {
              CustomUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  }
                  return {
                    me: result.login.user,
                  };
                },
              );
            },
            register: (_result, _args, cache) => {
              CustomUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  }
                  return {
                    me: result.register.user,
                  };
                },
              );
            },
            logout: (_result, _args, cache) => {
              CustomUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null }),
              );
            },
            deleteUserAsAdmin: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'User',
                id: (args as DeleteUserAsAdminMutationVariables).id,
              });
            },
            deleteProductAsAdmin: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Product',
                id: (args as DeleteProductAsAdminMutationVariables).id,
              });
            },
            makeUserAdmin: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'User',
                id: (args as MakeUserAdminMutationVariables).id,
              });
            },
            makeUserRegularUser: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'User',
                id: (args as MakeUserRegularUserMutationVariables).id,
              });
            },
            createProduct: (_result, _args, cache) => {
              invalidateAllProducts(cache);
            },
            deleteProduct: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Product',
                id: (args as DeleteProductMutationVariables).id,
              });
            },
            likeProduct: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Product',
                id: (args as DeleteProductMutationVariables).id,
              });
            },
            createOrder: (_result, _args, cache) => {
              invalidateAllOrders(cache);
            },
            createCart: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Cart',
                id: (args as CreateCartMutationVariables).productId,
              });
            },
            updateCartQuantity: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Cart',
                id: (args as UpdateCartQuantityMutationVariables).id,
              });
            },
            deleteCartItem: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Cart',
                id: (args as DeleteCartItemMutationVariables).id,
              });
            },
            deleteCart: (_result, _args, cache) => {
              invalidateAllCarts(cache);
            },
            createReview: (_result, _args, cache) => {
              invalidateAllReviews(cache);
            },
            deleteReview: (_result, args, cache) => {
              cache.invalidate({
                __typename: 'Review',
                id: (args as DeleteReviewMutationVariables).id,
              });
            },
          },
        },
      }),
      multipartFetchExchange,
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
