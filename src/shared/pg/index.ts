import type { Expression, SelectExpression } from './operations/select/index'
import type { Column, TableName } from './types'

import { select } from './operations/select/index'

export { insert } from './operations/insert'
export { pool } from './queries'

export function table<T extends TableName>(table: T, options?: { distinct?: boolean }) {
  const { distinct } = options ?? {}
  return {
    select<
      N extends TableName = T,
      E extends SelectExpression = Expression<N | T>,
      A extends `"${string}"."${string}"` = Column<N>,
    >(expression: E, options?: { alias?: Partial<Record<A, string>> | string }) {
      const { alias } = options ?? {}
      return select({ alias, base: '', distinct: distinct ?? false, expression, from: table })
    },
  }
}
