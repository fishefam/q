import type { tables } from '@db'
import type { DatabaseError } from 'pg'

import { Pool } from 'pg'
import pgFormat from 'pg-format'

import { createArray } from '.'

export type Where<T extends TableName> =
  | [Column<T>, Operator, unknown, 'AND' | 'OR']
  | [Column<T>, Operator, unknown]
type Column<T extends TableName> = Tables[T]['columns'][number]
type Operator = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'BETWEEN' | 'IN' | 'LIKE'
type QueryError = { detail: string | undefined; message: string }
type Result<T extends TableName> =
  | [QueryError, undefined]
  | [undefined, Row<T>[]]
type Row<T extends TableName> = Tables[T]['$type']
type TableName = keyof Tables
type Tables = typeof tables

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export function insert<T extends TableName>(
  table: T,
  data: Tables[T]['$input'][],
  options?: { closePool?: boolean },
) {
  if (data.length === 0) return [{ message: 'Empty Data' }, undefined]

  const columns = Object.keys(data[0] ?? '{}') as Column<T>[]
  const rawBaseQuery = `INSERT INTO %I(${columns.map(() => '%I').join(', ')}) VALUES `
  const baseQuery = pgFormat(rawBaseQuery, table, ...columns)
  const values: unknown[] = []
  const placeholders = data.map((row, index) => {
    const { length } = columns
    const offset = index * length
    const getOffset = (index: number) => `$${offset + index + 1}`
    const offsetString = createArray(length).map((_, index) => getOffset(index))
    for (const column of columns) values.push(row[column as never])
    return `(${offsetString.join(', ')})`
  })
  const query = baseQuery + placeholders + ' RETURNING *;'
  return _query<T>(query, values, options)
}

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
  const query = pgFormat(rawQuery, ...columnList, table, ...flatWhere, limit)
  const values = where.map((item) => item[2])
  return _query<T>(query, values, options)
}

async function _query<T extends TableName>(
  query: string,
  values: unknown[],
  options?: { closePool?: boolean },
) {
  const result = [undefined, undefined] as unknown as Result<T>
  try {
    const { rows } = await pool.query<Row<T>>(query, values)
    result[1] = rows
  } catch (error) {
    const { detail, message } = <DatabaseError>error
    result[0] = { detail, message }
  } finally {
    if (options?.closePool) await pool.end()
    return result
  }
}

function validateWhere<T extends TableName>(input: undefined | Where<T>[]) {
  const where = input ?? []
  const last = where?.at(-1)
  const isLastUndefined = !last
  const isLastValid = last?.length === 3
  if (isLastUndefined) return where
  if (isLastValid) return [...where.slice(0, -1), last]
  return [...where.slice(0, -1), last.slice(0, -1)]
}
