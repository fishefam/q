import { createArray } from '@/shared/utilities'
import { format } from 'node-pg-format'

import type { Column, TableName, Tables } from '../types'

import { baseQuery as execute } from '../queries'

export function insert<T extends TableName>(table: T, data: Tables[T]['$input'][]) {
  if (data.length === 0) return [{ message: 'Empty Data' }, undefined]

  const columns = Object.keys(data[0] ?? '{}') as Column<T>[]
  const rawBaseQuery = `INSERT INTO %I(${columns.map(() => '%I').join(', ')}) VALUES `
  const baseQuery = format(rawBaseQuery, table, ...columns)
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
  return execute<T, null>(query, values)
}
