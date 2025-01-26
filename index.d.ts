/* eslint-disable unicorn/prevent-abbreviations */
import type React from 'react'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      DATABASE_URL_UNPOOLED: string
    }
  }
}

declare global {
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

  type StringRecord = Record<string, string>

  type UnknownRecord = Record<string, unknown>

  type UseState<T> = [T, SetState<T>]
}
