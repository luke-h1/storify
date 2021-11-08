import { User, UserResponse } from '../types';
import storifyApi from './client/Client';

const userService = {
  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<UserResponse> => {
    const { data } = await storifyApi.post('/api/users', {
      name,
      email,
      password,
    });
    return data;
  },
  login: async (email: string, password: string): Promise<UserResponse> => {
    const { data } = await storifyApi.post('/api/users/login', { email, password });
    return data;
  },
  updateProfile: async (user: User): Promise<UserResponse> => {
    const { data } = await storifyApi.put('/api/users/profile', user)
    return data;
  },
  listUsers: async ():Promise<User[]> => {
    const { data } = await storifyApi.get('/api/users')
    return data;
  },
  updateUser: async (user: User): Promise<UserResponse> => {
    const { data } = await storifyApi.put(`/api/users/${user._id}`, user);
    return data;
  },
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const { data } = await storifyApi.delete(`/api/users/${id}`)
    return data;
  },
  getUserDetails: async(id: string): Promise<UserResponse> => {
    const { data } = await storifyApi.get(`/api/users/${id}`);
    return data;
  }
};
export default userService;
