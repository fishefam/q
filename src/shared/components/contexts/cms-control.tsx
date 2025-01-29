'use client'

import { createContext, useContext, useState } from 'react'

type Context = {
  isResponsiveView: boolean
  isSidebarVisible: boolean
  setIsResponsiveView: Set<'isResponsiveView'>
  setIsSidebarVisible: Set<'isSidebarVisible'>
}

type Set<T extends Exclude<keyof Context, `set${string}`>> = SetState<
  Context[T]
>

const Context = createContext({} as Context)

export function CMSControlProvider({ children }: Properties) {
  const [isResponsiveView, setIsResponsiveView] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const value = {
    isResponsiveView,
    isSidebarVisible,
    setIsResponsiveView,
    setIsSidebarVisible,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCMSControlContext() {
  return useContext(Context)
}
