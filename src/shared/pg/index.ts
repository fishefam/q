import type { Column, TableName } from './types'

import { select } from './operations/select/index'

export { insert } from './operations/insert'
export { pool } from './queries'

type Columns<T extends TableName> = ([Column<T>, string] | Column<T>)[] | ([string, string] | string)[] | ['*']

export function database<T extends TableName>(table: T) {
  return {
    select: (...columns: Columns<T>) => select(table, false, ...columns),
    selectDistinct: (...columns: Columns<T>) => select(table, true, ...columns),
  }
}
