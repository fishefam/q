import type { TableName, Where } from './types'

export function validateWhere<T extends TableName>(
  input: undefined | Where<T>[],
) {
  const where = input ?? []
  const last = where?.at(-1)
  const isLastUndefined = !last
  const isLastValid = last?.length === 3
  if (isLastUndefined) return where
  if (isLastValid) return [...where.slice(0, -1), last]
  return [...where.slice(0, -1), last.slice(0, -1)]
}
