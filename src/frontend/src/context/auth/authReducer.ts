import { User } from '../../../../common/src/types';

type Action =
  | { type: 'REGISTER_SUCCESS'; user: User; loading: false; token: string }
  | { type: 'LOGIN_SUCCESS'; user: User; loading: false; token: string }
  | { type: 'USER_LOADED'; user: User; token: string; loading: false }
  | { type: 'REGISTER_FAIL'; user: null; token: null; loading: false }
  | { type: 'LOGIN_FAIL'; user: null; loading: false; token: null }
  | { type: 'LOGOUT'; user: null; loading: false; token: null }
  | { type: 'AUTH_ERROR'; user: null; loading: false; token: null }
  | { type: 'REGISTER_REQUEST'; user: null; loading: true; token: null }
  | { type: 'LOGIN_REQUEST'; user: null; loading: true; token: null }
  | { type: 'LOGOUT_REQUEST'; user: null; loading: true; token: null };

type State = {
  loading: boolean;
  error?: string;
  user?: User;
};

function AuthReducer(state: State, action: Action) {
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
