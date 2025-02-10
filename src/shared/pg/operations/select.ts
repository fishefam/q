import format from 'pg-format'

import type { Column, TableName, Where } from '../types'

import { basePgQuery } from '../base-query'
import { validateWhere } from '../helpers'

export function select<T extends TableName>(
  table: T,
  columns: '*' | Column<T>[] = '*',
  options?: { closePool?: boolean; limit?: number; where?: Where<T>[] },
) {
  const { limit } = options ?? {}
  const where = validateWhere(options?.where)
  const rawBaseQuery = `SELECT ${typeof columns === 'string' ? '%I' : columns.map(() => '%I').join(', ')} FROM %I`
  const rawWhereClause = `${where.length > 0 ? ' WHERE ' + where.map(([_, __, ___, next], index) => `%I %s $${index + 1}${next ? ' ' + next : ''}`).join(' ') : ''}`
  const rawLimitClause = `${limit ? ' LIMIT %s' : ''}`
  const rawQuery = rawBaseQuery + rawWhereClause + rawLimitClause
  const columnList = columns === '*' ? [columns] : columns
  const flatWhere = where.flatMap(([left, op]) => [left, op])
  const query = format(rawQuery, ...columnList, table, ...flatWhere, limit)
  const values = where.map((item) => item[2])
  return basePgQuery<T>(query, values, options)
}
