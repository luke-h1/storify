import { getErrorFromResponse } from '@src/utils/fetch';
import userService from '@storify/common/src/services/userService';
import { Dispatch } from 'react';
import { toast } from 'react-hot-toast';
import { Authenticate, SetAuthLoading } from '../types';

export const register =
  (firstName: string, lastName: string, email: string, password: string) =>
  async (dispatch: Dispatch<Authenticate | SetAuthLoading>) => {
    try {
      const { data } = await userService.register(
        firstName,
        lastName,
        email,
        password,
      );
      dispatch({ type: 'AUTHENTICATE', user: data.user, isAuth: true });
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
    return null;
  };
