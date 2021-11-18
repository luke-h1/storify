import { UsernamePasswordInput } from './UsernamePasswordInput';

export class UserRegisterInput extends UsernamePasswordInput {
  firstName: string;

  lastName: string;

  bio: string;
}
