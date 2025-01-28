'use client'

import { createContext, useContext, useState } from 'react'

type Context = {
  isResponsiveView: boolean
  setIsResponsiveView: Set<'isResponsiveView'>
}

type Set<T extends Exclude<keyof Context, `set${string}`>> = SetState<
  Context[T]
>

const Context = createContext({} as Context)

export function CMSControlProvider({ children }: Properties) {
  const [isResponsiveView, setIsResponsiveView] = useState(true)

  const value = {
    isResponsiveView,
    setIsResponsiveView,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCMSControlContext() {
  return useContext(Context)
}
