import { User } from '../../../../common/src/types';

type Action =
  | {
      type: 'REGISTER_SUCCESS';
      user: Pick<User, '_id' | 'email' | 'isAdmin' | 'name' | 'token'>;
      loading: false;
      token: string;
      error: null;
    }
  | {
      type: 'LOGIN_SUCCESS';
      user: Pick<User, '_id' | 'email' | 'isAdmin' | 'name' | 'token'>;
      loading: false;
      token: string;
      error: null;
    }
  | {
      type: 'USER_LOADED';
      user: Pick<User, '_id' | 'email' | 'isAdmin' | 'name' | 'token'>;
      token: string;
      loading: false;
      error: null;
    }
  | {
      type: 'REGISTER_FAIL';
      user: null;
      token: null;
      loading: false;
      error: string;
    }
  | {
      type: 'LOGIN_FAIL';
      user: null;
      loading: false;
      token: null;
      error: string;
    }
  | { type: 'LOGOUT'; user: null; loading: false; token: null; error: null }
  | {
      type: 'AUTH_ERROR';
      user: null;
      loading: false;
      token: null;
      error: string;
    }
  | {
      type: 'REGISTER_REQUEST';
      user: null;
      loading: true;
      token: null;
      error: null;
    }
  | {
      type: 'LOGIN_REQUEST';
      user: null;
      loading: true;
      token: null;
      error: null;
    }
  | {
      type: 'LOGOUT_REQUEST';
      user: null;
      loading: true;
      token: null;
      error: null;
    };

export type State = {
  loading: boolean;
  error: string | null;
  user: Pick<User, '_id' | 'email' | 'isAdmin' | 'name' | 'token'> | null;
  token: string | null;
};

function AuthReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        loading: false,
        user: action.user,
        token: action.user.token,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.user));
      localStorage.setItem('token', JSON.stringify(action.user.token));
      return {
        ...state,
        loading: false,
        user: action.user,
        token: action.user.token,
      };

    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {
        user: null,
        error: null,
        loading: false,
        token: null,
      };

    default: {
      return state;
    }
  }
}
export default AuthReducer;
