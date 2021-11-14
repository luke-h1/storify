import { createContext } from 'react';
import { State } from './authReducer';

const authContext = createContext<State | undefined>(undefined);

export default authContext;
