import React, { ReactNode, useReducer, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import authReducer, { State } from './authReducer';
import userService from '../../../../common/src/services/userService';
import { REGISTER_REQUEST } from '../constants/AuthConstants';

interface Props {
  children: React.ReactNode;
}

const AuthState = ({ children }: Props) => {
  const history = useHistory();

  const initialState: State = {
    loading: false,
    user: JSON.parse(localStorage.getItem('user') as string),
    token: localStorage.getItem('token') as string,
    error: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({
        type: 'REGISTER_REQUEST',
        user: null,
        loading: true,
        token: null,
        error: null,
      });

      const res = await userService.register(name, email, password);
      dispatch({
        type: 'REGISTER_SUCCESS',
        user: {
          name: res.name,
          email: res.email,
          _id: res._id,
          isAdmin: res.isAdmin,
          token: res.token,
        },
        error: null,
        loading: false,
        token: res.token,
      });
      dispatch({
        type: 'LOGIN_SUCCESS',
        user: {
          name: res.name,
          email: res.email,
          _id: res._id,
          isAdmin: res.isAdmin,
          token: res.token,
        },
        error: null,
        loading: false,
        token: res.token,
      });
    } catch (e: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        user: null,
        loading: false,
        token: null,
        error:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      });
    }
  };
  const login = async (email: string, password: string) => {
    try {
      dispatch({
        type: 'LOGIN_REQUEST',
        user: null,
        loading: true,
        token: null,
        error: null,
      });
      const res = await userService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        user: {
          _id: res._id,
          email: res.email,
          isAdmin: res.isAdmin,
          name: res.name,
          token: res.token,
        },
        token: res.token,
        error: null,
        loading: false,
      });
    } catch (e: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        user: null,
        token: null,
        loading: false,
        error:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      });
    }
  };
};
export default AuthState;
