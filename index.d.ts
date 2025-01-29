/* eslint-disable unicorn/prevent-abbreviations */
import type { AuthErrorMessage } from '@/shared/auth/utilities'
import type React from 'react'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BLOB_TOKEN: string
      BLOB_URL: string
      DATABASE_URL: string
      NEXT_PUBLIC_AUTH_PROVIDER: string | undefined
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string | undefined
      NEXT_PUBLIC_SUPABASE_URL: string | undefined
    }
  }
}

declare global {
  type AuthData = { redirectTo?: Path } & Record<'email' | 'password', string>

  type AuthError = Partial<Record<'action' | keyof AuthData, AuthErrorMessage>>

  type GlobalThis = typeof globalThis

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

  type Path = `/${string}`

  type Properties<T = UnknownRecord> = {
    children?: ReactNode
    className?: string
  } & T

  type ReactNode = React.ReactNode

  type SetState<T> = React.Dispatch<React.SetStateAction<T>>

  type StringRecord = Record<string, string>

  type UnknownRecord = Record<string, unknown>

  type UseState<T> = [T, SetState<T>]
}
