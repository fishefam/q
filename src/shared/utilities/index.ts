import type { RefObject } from 'react'

export function isClientSide() {
  return !!globalThis.window
}

export function isReferenceObject<T>(
  reference: unknown,
): reference is RefObject<T> {
  return !!reference && reference instanceof Object && 'current' in reference
}
