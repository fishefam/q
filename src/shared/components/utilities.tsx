import type { RefObject } from 'react'

import { cloneElement, isValidElement } from 'react'
import { createPortal } from 'react-dom'

import { isReferenceObject } from '../utilities'
import { select } from '../utilities/dom'

export function Portal({
  children,
  container,
}: Properties<{
  container: DocumentFragment | Element | RefObject<Element | null> | string
}>) {
  const target =
    typeof container === 'string'
      ? select(container)
      : isReferenceObject(container)
        ? container.current
        : container
  if (target) return createPortal(children, target)
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
