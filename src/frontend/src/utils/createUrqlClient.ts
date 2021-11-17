import { SSRExchange } from '@urql/core/dist/types/exchanges/ssr';
import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import Router from 'next/router';
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  ClientOptions,
  stringifyVariables,
} from 'urql';
import { pipe, tap } from 'wonka';
import { MeDocument, MeQuery } from '../generated/graphql';
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
      }),
    );
  };

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
      cacheExchange({}),
      multipartFetchExchange,
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
