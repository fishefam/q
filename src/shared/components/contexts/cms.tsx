'use client'

import type { Node, Page } from '@db'

import { createContext, useContext, useState } from 'react'

type Context = {
  nodes: Map_<Node>
  pages: Page[]
  setNodes: Set<'nodes'>
  setPages: Set<'pages'>
}

type Map_<T> = Map<string, T>

type ProviderProperties = { initialNodes: Node[]; initialPages: Page[] }

type Set<T extends SetKey> = SetState<Context[T]>

type SetKey = Exclude<keyof Context, `set${string}`>

const Context = createContext({} as Context)

export function CMSProvider(properties: Properties<ProviderProperties>) {
  const { initialNodes } = properties
  const intialNodeEntries = initialNodes.map((node) => [node.id, node])
  const initialNodeMap = new Map(intialNodeEntries as [string, Node][])

  const [pages, setPages] = useState<Context['pages']>(properties.initialPages)
  const [nodes, setNodes] = useState<Context['nodes']>(initialNodeMap)

  const value: Context = { nodes, pages, setNodes, setPages }

  return (
    <Context.Provider value={value}>{properties.children}</Context.Provider>
  )
}

export function useCMSContext() {
  return useContext(Context)
}
