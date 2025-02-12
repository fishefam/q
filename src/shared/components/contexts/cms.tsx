'use client'

import type { Node, Page } from '@database'

import { createContext, useContext, useEffect, useState } from 'react'

type Context = {
  nodes: NodeMap<{ setState: SetState<Node>; state: Node }>
  page: Page | undefined
  pages: Page[]
  setPage: Set<'page'>
  setPages: Set<'pages'>
}

type ProviderProperties = { nodes: Node[]; pages: Page[] }

type Set<T extends SetKey> = SetState<Context[T]>

type SetKey = Exclude<keyof Context, `set${string}`>

const Context = createContext({} as Context)

export function CMSProvider(properties: Properties<ProviderProperties>) {
  const [pages, setPages] = useState(properties.pages)
  const [page, setPage] = useState(pages.at(0))
  const { nodes } = useNodeMap(page)

  const { children } = properties
  const value: Context = { nodes, page, pages, setPage, setPages }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCMSContext() {
  return useContext(Context)
}

function useNodeMap(page: Page | undefined) {
  const [nodes] = useState(new Map() as Context['nodes'])
  useEffect(() => nodes.clear(), [nodes, page])
  return { nodes }
}
