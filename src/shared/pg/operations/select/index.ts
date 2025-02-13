import { format } from 'node-pg-format'

import type { Column, TableName } from '../../types'
import type { Method } from './build-query'

import { buildQuery } from './build-query'

type SelectReturn = Omit<
  ReturnType<typeof buildQuery>,
  'having' | 'havingGroupEnd' | 'havingGroupStart' | 'whereGroupEnd'
>

export function select<T extends TableName>(
  from: [T, string] | T,
  ...columns: ([Column<T>, string] | Column<T>)[] | ([string, string] | string)[] | ['*']
): SelectReturn {
  return shared(from, false, ...columns)
}

export function selectDistinct<T extends TableName>(
  from: [T, string] | T,
  ...columns: ([Column<T>, string] | Column<T>)[] | ([string, string] | string)[] | ['*']
): SelectReturn {
  return shared(from, true, ...columns)
}

function shared<T extends TableName>(
  from: [T, string] | T,
  distinct: boolean,
  ...columns: ([Column<T>, string] | Column<T>)[] | ([string, string] | string)[] | ['*']
) {
  const isAsterisk = columns.length === 1 && columns[0] === '*'
  const alias = Array.isArray(from) ? from[1] : undefined
  const selectRaw = `SELECT ${distinct ? 'DISTINCT' : ''}${columns.map((column) => (isAsterisk ? '%s' : `%I${Array.isArray(column) ? ' AS %I' : ''}`)).join(', ')}`
  const selectQuery = format(selectRaw, ...columns.flat(Number.POSITIVE_INFINITY))
  const fromRaw = `${selectQuery} FROM %I${alias ? ' %I' : ''}`
  const fromQuery = alias ? format(fromRaw, from[0], alias) : format(fromRaw, from)
  return buildQuery<T, Method>(fromQuery, [], undefined, []) as SelectReturn
}
