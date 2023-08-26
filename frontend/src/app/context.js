import { createContext, useContext } from 'react';

export const initialValue = {
  userToken: undefined,
};

export const Context = createContext(initialValue);
export const useContextHook = useContext;
