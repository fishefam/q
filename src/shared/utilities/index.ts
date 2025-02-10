import type { RefObject } from 'react'

import { LoremIpsum } from 'lorem-ipsum'

export function isClientSide() {
  return !!globalThis.window
}

export function isReferenceObject<T>(
  reference: unknown,
): reference is RefObject<T> {
  return !!reference && reference instanceof Object && 'current' in reference
}

export function lorem() {
  return new LoremIpsum()
}
