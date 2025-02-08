import type React from 'react'

// general
declare global {
  type AuthProvider = 'auth0' | 'firebase' | 'supabase'
  type GlobalThis = typeof globalThis
  type Path = `/${string}`
  type StringRecord = Record<string, string>
  type UnknownRecord = Record<string, unknown>
}

// process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_PROVIDER: AuthProvider | undefined
      BLOB_TOKEN: string
      BLOB_URL: string
      DATABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string | undefined
      NEXT_PUBLIC_SUPABASE_URL: string | undefined
    }
  }
}

// react
declare global {
  type ContextKey<T> = Exclude<keyof T, `set${string}`>

  type HOC = (element: React.JSX.Element) => React.JSX.Element

  type HTMLAttributes = React.HTMLAttributes<HTMLElement> &
    React.ImgHTMLAttributes<HTMLImageElement> &
    Record<`data-${string}`, string>

  type HTMLTagName = keyof HTMLElementTagNameMap

  type LayoutProperties<P = UnknownRecord> = { children: ReactNode } & {
    params: Promise<P>
  }

  type PageProperties<P = UnknownRecord, S = UnknownRecord> = {
    params: Promise<P>
    searchParams: Promise<Partial<S>>
  }

  type Properties<T = UnknownRecord> = {
    children?: ReactNode
    className?: string
  } & T

  type ReactNode = React.ReactNode

  type SetState<T> = React.Dispatch<React.SetStateAction<T>>

  type UseStateReturn<T> = [T, SetState<T>]
}
