'use client'

import { createContext, useContext } from 'react'

type Context = UnknownRecord

const Context = createContext({} as Context)

export function GlobalProvider(properties: Properties) {
  const { children } = properties
  return <Context.Provider value={{}}>{children}</Context.Provider>
}

export function useGlobalContext() {
  return useContext(Context)
}
