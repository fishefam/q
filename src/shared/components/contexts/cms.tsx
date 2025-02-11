'use client'

import type { Page } from '@database'

import { createContext, useContext, useState } from 'react'

type Context = {
  pages: Page[]
  setPages: Set<'pages'>
}

type ProviderProperties = { pages: Page[] }

type Set<T extends SetKey> = SetState<Context[T]>

type SetKey = Exclude<keyof Context, `set${string}`>

const Context = createContext({} as Context)

export function CMSProvider(properties: Properties<ProviderProperties>) {
  const [pages, setPages] = useState<Context['pages']>(properties.pages)

  const value: Context = { pages, setPages }

  return (
    <Context.Provider value={value}>{properties.children}</Context.Provider>
  )
}

export function useCMSContext() {
  return useContext(Context)
}
