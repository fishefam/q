'use client'

import { createContext, useContext } from 'react'

type Context = UnknownRecord

const Context = createContext({} as Context)

export function CMSProvider({ children }: Properties) {
  return <Context.Provider value={{}}>{children}</Context.Provider>
}

export function useCMSContext() {
  return useContext(Context)
}
