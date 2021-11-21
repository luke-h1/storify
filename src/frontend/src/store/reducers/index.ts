import { State } from '@src/types/State';
import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';

export default combineReducers<State>({
  auth: AuthReducer,
});
