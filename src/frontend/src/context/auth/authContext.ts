import { createContext } from 'react';
import { State } from './authReducer';

const AuthContext = createContext<State | undefined>(undefined);

export default AuthContext;
