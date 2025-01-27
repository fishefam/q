import type { JSX, RefObject } from 'react'

import isElement from 'lodash/isElement'
import { cloneElement, isValidElement } from 'react'
import { createPortal } from 'react-dom'

import { isReferenceObject } from '.'
import { select } from './dom'

export function Portal({
  children,
  container,
}: Properties<{
  container:
    | DocumentFragment
    | Element
    | null
    | RefObject<Element | null>
    | string
    | undefined
}>) {
  const target =
    typeof container === 'string'
      ? select(container)
      : isReferenceObject(container)
        ? container.current
        : container
  if (target && isElement(target)) return createPortal(children, target)
}

export function PropertyInjector<T extends UnknownRecord>({
  children,
  ...properties
}: Properties<T>) {
  if (isValidElement(children))
    return cloneElement(children, {
      ...(typeof children.props === 'object' ? children.props : {}),
      ...properties,
    })
}

export function Render({ children, if: _if }: Properties<{ if: boolean }>) {
  return _if ? children : undefined
}

export function Wrap({
  children,
  if: if_ = true,
  Wrapper,
}: Properties<{
  if?: boolean
  Wrapper: (_: { children: ReactNode }) => JSX.Element
}>) {
  let element = children
  if (if_) element = <Wrapper>{element}</Wrapper>
  return element
}
