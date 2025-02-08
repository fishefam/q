'use client'

import { createContext, useContext, useState } from 'react'

type Context = {
  isBoxView: boolean
  isResponsiveView: boolean
  isSidebarOpen: boolean
  setIsBoxView: Set<'isBoxView'>
  setIsResponsiveView: Set<'isResponsiveView'>
  setIsSidebarOpen: Set<'isSidebarOpen'>
}

type Set<T extends ContextKey<Context>> = SetState<Context[T]>

const Context = createContext({} as Context)

export function CMSControlProvider({ children }: Properties) {
  const [isBoxView, setIsBoxView] = useState(false)
  const [isResponsiveView, setIsResponsiveView] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const value: Context = {
    isBoxView,
    isResponsiveView,
    isSidebarOpen,
    setIsBoxView,
    setIsResponsiveView,
    setIsSidebarOpen,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCMSControlContext() {
  return useContext(Context)
}
