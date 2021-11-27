import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers';

let store: Store | undefined;

function initStore(initState: Record<string, unknown>): Store {
  return createStore(
    reducers,
    initState,
    composeWithDevTools(applyMiddleware(thunk)),
  );
}

export const initializeStore = (preloadState: any = {}) => {
  // eslint-disable-next-line no-underscore-dangle
  let _store = store ?? initStore(preloadState);

  if (preloadState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadState,
    });

    store = undefined;
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;

  return _store;
};

export function useStore(initState: AppProps) {
  // eslint-disable-next-line no-shadow
  const store = useMemo(() => initializeStore(initState), [initState]);

  return store;
}
