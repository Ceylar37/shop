'use client';

import {useInfoQuery} from '@/client/services/auth';
import {User} from '@prisma/client';
import {PropsWithChildren, createContext, useContext} from 'react';
import {P, match} from 'ts-pattern';
import Loader from '../Loader';
import Login from '../Login';

type AuthData = Required<Omit<User, 'password' | 'token'>>;

const AuthContext = createContext<AuthData>({} as AuthData);

export default function AuthProvider({children}: PropsWithChildren) {
  const info = useInfoQuery();
  return match(info)
    .with({isLoading: true}, () => <Loader />)
    .with({error: {message: 'Unauthorized'}}, () => <Login />)
    .with({data: P.not(undefined)}, ({data}) => <AuthContext.Provider value={data}>{children}</AuthContext.Provider>)
    .otherwise(() => <h1>Неизвестная ошибка</h1>);
}

export const useAuthContext = () => useContext(AuthContext);
