import { State } from '../../types/State';
import { Authenticate, SetAuthLoading } from '../types';

type Actions = Authenticate | SetAuthLoading;

const initState: State['auth'] = {
  isAuth: false,
  user: null,
  loading: false,
};

export default function AuthReducer(
  state = initState,
  action: Actions,
): State['auth'] {
  switch (action.type) {
    case 'AUTHENTICATE': {
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
      };
    }
    case 'SET_AUTH_LOADING': {
      return {
        ...state,
        loading: state.loading,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
