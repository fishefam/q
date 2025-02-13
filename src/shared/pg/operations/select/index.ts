import { format } from 'node-pg-format'

import type { Column, TableName } from '../../types'
import type { Method } from './build-query'

import { buildQuery } from './build-query'

export function select<T extends TableName>(
  from: [T, string] | T,
  distinct: boolean,
  ...columns: ([Column<T>, string] | Column<T>)[] | ([string, string] | string)[] | ['*']
) {
  const alias = Array.isArray(from) ? from[1] : undefined
  const selectRaw = `SELECT ${distinct ? 'DISTINCT ' : ''}${columns.map((column) => (column === '*' || (typeof column === 'string' && /^\$\$/.test(column)) || (Array.isArray(column) && /^\$\$/.test(column[0])) ? '%s' : `%I${Array.isArray(column) ? ' AS %I' : ''}`)).join(', ')}`
  const selectQuery = format(
    selectRaw,
    ...columns
      .flat(Number.POSITIVE_INFINITY)
      .map((value) => (typeof value === 'string' ? value.replace(/^\$\$/, '') : value)),
  )
  const fromRaw = `${selectQuery} FROM %I${alias ? ' %I' : ''}`
  const fromQuery = alias ? format(fromRaw, from[0], alias) : format(fromRaw, from)
  const query = buildQuery<T, Method>(fromQuery, [], undefined, [])
  return query as Omit<typeof query, 'whereGroupEnd' | `having${string}`>
}
