import type * as Db from '@db'
import type { DatabaseError } from 'pg'

import { Pool } from 'pg'
import pgFormat from 'pg-format'

import { createArray } from '.'

type Operator = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'BETWEEN' | 'IN' | 'LIKE'
type TableName = keyof Tables
type Tables = typeof Db.tables

export async function insert<T extends TableName>(
  table: T,
  data: Tables[T]['$input'][],
) {
  if (!data.length) throw new Error('Insert: Empty data')

  const columns = Object.keys(data[0]) as Tables[T]['columns'][number][]
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const baseQuery = pgFormat(
    `INSERT INTO %I(${columns.map(() => '%I').join(', ')}) VALUES `,
    table,
    ...columns,
  )
  const values: unknown[] = []
  const placeholders = data.map((row, i) => {
    const offset = i * columns.length
    for (const column of columns) values.push(row[column as never])
    const offsetString = createArray(columns.length).map(
      (_, i) => `$${offset + i + 1}`,
    )
    return `(${offsetString.join(', ')})`
  })
  const queryText = baseQuery + placeholders

  try {
    await pool.query(queryText, values)
    await pool.end()
  } catch (error) {
    await pool.end()
    const { detail, message } = <DatabaseError>error
    return { detail, message }
  }
}

export async function select<T extends TableName>(
  table: T,
  columns: '*' | Tables[T]['columns'][number][] = '*',
  options?: {
    limit?: number
    where?: (
      | [Tables[T]['columns'][number], Operator, unknown, 'AND' | 'OR']
      | [Tables[T]['columns'][number], Operator, unknown]
    )[]
  },
) {
  const { limit, where } = options ?? {}
  const _where = where?.length
    ? [...where.slice(0, -1), where.at(-1)!.slice(0, -1)]
    : []
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const rawBaseQuery = `SELECT ${typeof columns === 'string' ? '%I' : columns.map(() => '%I').join(', ')} FROM %I`
  const rawWhereClause = `${_where.length ? ' WHERE ' + _where.map(([_, __, ___, next], i) => `%I %s $${i + 1}${next ? ' ' + next : ''}`).join(' ') : ''}`
  const rawLimitClause = `${limit ? ' LIMIT %s' : ''}`
  const rawQuery = rawBaseQuery + rawWhereClause + rawLimitClause
  const query = pgFormat(
    rawQuery,
    ...(columns === '*' ? [columns] : columns),
    table,
    ...(_where.length ? _where.flatMap(([left, op]) => [left, op]) : []),
    limit,
  )

  try {
    const result = await pool.query<Tables[T]['$type']>(
      query,
      where ? where.map(([_, __, right]) => right) : [],
    )
    await pool.end()
    return result.rows
  } catch {
    await pool.end()
    return []
  }
}
