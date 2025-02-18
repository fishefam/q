/* eslint-disable import/namespace */

import * as database from '@database'
import { isObject } from 'lodash'
import { format } from 'node-pg-format'
import { format as sqlPrettier } from 'sql-formatter'

import type { Column, TableName } from '../../types'
import type { Method } from './builder'

import { buildQuery } from './builder'

export type Expression<T extends TableName> = `"${T}".*` | Column<T>
export type SelectExpression = `"${string}".${'*' | `"${string}"`}` | `$$${string}`
type Database = typeof database
type SelectProperties<T extends TableName, A extends `"${string}"."${string}"` = Column<T>> = {
  alias?: Partial<Record<A, string>> | string
  base: string
  distinct: boolean
  expression: string
  from: T
}
type Table<T extends TableName> = Database[T]

export function select<T extends TableName, A extends `"${string}"."${string}"` = Column<T>>(
  properties: SelectProperties<T, A>,
) {
  const { alias, base, distinct, expression, from } = properties
  const hasDistinct = / DISTINCT /.test(base)
  const tableName = isStar(expression) ? expression.split('.')[0] : from
  const { columns } = database[tableName.replaceAll('"', '') as keyof Database] as Table<T>
  const expressions = isStar(expression)
    ? columns
        .map((column) => [column, isObject(alias) ? alias[`"${from}"."${column}"` as A] : undefined])
        .map(([column, alias]) => `"${from}"."${column}"${alias ? ` AS "${alias.replaceAll('"', '')}"` : ''}`)
    : [expression]
  const selectRaw = `${base.length > 0 ? `${base.replace(/ FROM.*$/, '')},` : 'SELECT'}${distinct && !hasDistinct ? ' DISTINCT ' : ''} ${expressions.map(() => '%s').join(', ')}${typeof alias === 'string' ? ` AS "${alias.replaceAll('"', '')}"` : ''}`
  const selectQuery = format(selectRaw, ...expressions).replaceAll('$$', '')
  const fromQuery = format(`FROM %I`, from)
  const query = `${selectQuery} ${fromQuery}`
  const operations = buildQuery<T, Method>(query, [], undefined, [])

  return {
    ...operations,
    select: <S extends TableName = T, U extends SelectExpression = Expression<S | T>>(
      expression: U,
      options?: { alias?: Record<SelectExpression, string> | string; distinct?: boolean },
    ) => select({ alias: options?.alias, base: query, distinct: options?.distinct ?? false, expression, from }),
    toString: () => sqlPrettier(query),
  }
}

function isStar(expression: unknown) {
  return typeof expression === 'string' && /\.\*/.test(expression)
}
