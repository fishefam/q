import { fuzzyNumbersEqual } from './fuzzyNumbersEqual'

export function fuzzyLayoutsEqual(
  actual: number[],
  expected: number[],
  fractionDigits?: number,
): boolean {
  if (actual.length !== expected.length) {
    return false
  }

  for (const [index, element] of actual.entries()) {
    const actualSize = element as number
    const expectedSize = expected[index] as number

    if (!fuzzyNumbersEqual(actualSize, expectedSize, fractionDigits)) {
      return false
    }
  }

  return true
}
