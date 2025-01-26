import type { RefObject } from 'react'

export function isReferenceObject<T>(
  reference: unknown,
): reference is RefObject<T> {
  return (
    reference !== null &&
    typeof reference === 'object' &&
    'current' in reference
  )
}
