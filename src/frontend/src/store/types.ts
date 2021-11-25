import { User } from '@src/types/User';

export interface SetAuthLoading {
  type: 'SET_AUTH_LOADING';
  loading: boolean;
}

export interface Authenticate {
  type: 'AUTHENTICATE';
  isAuth: boolean;
  user: User | null;
}

export type States = 'ERROR' | 'LOADING' | 'DONE';

export interface SetState {
  type: 'SET_STATE';
  state: States;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
