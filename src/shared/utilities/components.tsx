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
  return children
}

export function PropertyInjector<T extends UnknownRecord>({
  children,
  ...properties
}: Properties<T>) {
  if (isValidElement(children))
    return cloneElement(children, {
      ...(children.props instanceof Object ? children.props : {}),
      ...properties,
    })
}

export function Render({ children, if: _if }: Properties<{ if: boolean }>) {
  return _if ? children : undefined
}

export function Wrap({
  children,
  if: if_ = true,
  wrapper,
}: Properties<{
  if?: boolean
  wrapper: (_: { children: ReactNode }) => JSX.Element
}>) {
  let element = children
  const Wrapper = wrapper
  if (if_) element = <Wrapper>{element}</Wrapper>
  return element
}
