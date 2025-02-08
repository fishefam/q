import type { HTMLAttributes, SVGAttributes } from 'react'

export function createElement<
  T extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
  U extends T extends keyof SVGElementTagNameMap
    ? SVGAttributes<SVGElement>
    : HTMLAttributes<HTMLElement>,
>(
  tag: T,
  options?: {
    attributes?: Partial<Record<`data-${string}`, number | object | string>> & U
    innerHTML?: string
    parent?: HTMLElement | string
    textContent?: string
  } & Partial<Record<'className' | 'id', string>>,
) {
  const element = document.createElement(tag)
  const { attributes, className, id, innerHTML, parent, textContent } =
    options ?? {}
  if (attributes)
    for (const [key, value] of Object.entries(attributes))
      if (['number', 'string'].includes(typeof value) || key.startsWith('on'))
        element.setAttribute(key, value)
  if (id) element.id = id
  if (className) element.className = className
  if (textContent) element.textContent = textContent
  if (innerHTML) element.innerHTML = innerHTML
  if (parent && typeof parent === 'string') select(parent)?.append(element)
  if (parent && typeof parent !== 'string') parent.append(element)
  return element
}

export function getStyleSheets() {
  const styleSheets = [...document.styleSheets].map(({ cssRules, href }) => ({
    css: [...cssRules].map(({ cssText }) => cssText).join(''),
    href: href ?? undefined,
  }))
  return [...new Set(styleSheets)]
}

export function select<T extends HTMLElement>(selector: string) {
  return document.querySelector<T>(selector)
}

export function selectAll<T extends HTMLElement>(selector: string) {
  return [...document.querySelectorAll<T>(selector)]
}
