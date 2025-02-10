import type { RefObject } from 'react'

import { LoremIpsum } from 'lorem-ipsum'

export function createArray(length: number, fill = 0) {
  return Array.from({ length }).fill(fill)
}

export function getRandomItem<T>(array: T[]) {
  return array[randomInt(0, array.length - 1)]
}

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

export function randomInt(min = 0, max = 9999) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
