export function compareLayouts(a: number[], b: number[]) {
  if (a.length === b.length) {
    for (const [index, element] of a.entries()) {
      if (element != b[index]) {
        return false
      }
    }
  } else {
    return false
  }
  return true
}
