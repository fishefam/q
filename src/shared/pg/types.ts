import type { tables } from '@database'

export type Column<T extends TableName> = Tables[T]['columns'][number]

export type Operator =
  | '<'
  | '<='
  | '<>'
  | '='
  | '>'
  | '>='
  | 'BETWEEN'
  | 'IN'
  | 'LIKE'

export type QueryError = { detail: string | undefined; message: string }

export type Result<T extends TableName> =
  | [QueryError, undefined]
  | [undefined, Row<T>[]]

export type Row<T extends TableName> = Tables[T]['$type']

export type TableName = keyof Tables

export type Tables = typeof tables

export type Where<T extends TableName> =
  | [Column<T>, Operator, unknown, 'AND' | 'OR']
  | [Column<T>, Operator, unknown]
