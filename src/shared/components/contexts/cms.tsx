'use client'

import type { Page } from '@database'

import { createContext, useContext, useState } from 'react'

type Context = {
  page: Page | undefined
  pages: Page[]
  setPage: Set<'page'>
  setPages: Set<'pages'>
}

type ProviderProperties = { pages: Page[] }

type Set<T extends SetKey> = SetState<Context[T]>

type SetKey = Exclude<keyof Context, `set${string}`>

const Context = createContext({} as Context)

export function CMSProvider(properties: Properties<ProviderProperties>) {
  const [pages, setPages] = useState(properties.pages)
  const [page, setPage] = useState(pages.at(0))

  const { children } = properties
  const value: Context = { page, pages, setPage, setPages }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCMSContext() {
  return useContext(Context)
}
