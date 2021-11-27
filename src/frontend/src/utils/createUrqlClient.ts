import { SSRExchange } from '@urql/core/dist/types/exchanges/ssr';
import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import Router from 'next/router';
import { toast } from 'react-hot-toast';
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  ClientOptions,
  stringifyVariables,
} from 'urql';
import { pipe, tap } from 'wonka';
import {
  MeDocument,
  MeQuery,
  LoginMutation,
  RegisterMutation,
  LogoutMutation,
} from '../generated/graphql';
import { CustomUpdateQuery } from './customUpdateQuery';
import { isServer } from './isServer';

const errorExchange: Exchange =
  ({ forward }) =>
  ops$ => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('Not authenticated')) {
          Router.replace('/login');
        }
        toast.error(error?.message as string);
        if (error?.networkError) {
          toast.error(error?.networkError as unknown as string);
        }
      }),
    );
  };

function invalidateAllProducts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'products');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'products', fi.arguments || {});
  });
}

export const createurqlClient = (
  ssrExchange: SSRExchange,
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
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (_result, args, cache) => {
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
            register: (_result, args, cache) => {
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
            logout: (_result, args, cache) => {
              CustomUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null }),
              );
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
