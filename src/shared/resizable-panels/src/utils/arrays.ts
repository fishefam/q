// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areEqual(arrayA: any[], arrayB: any[]): boolean {
  if (arrayA.length !== arrayB.length) {
    return false
  }

  for (const [index, element] of arrayA.entries()) {
    if (element !== arrayB[index]) {
      return false
    }
  }

  return true
}
