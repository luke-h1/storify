import storifyApi from './api/index';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string | null;
}

const userService = {
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    return storifyApi.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  },
};

export default userService;
