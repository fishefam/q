import { snakeCase } from 'lodash'
import { format } from 'node-pg-format'

import type { Column, TableName } from './types'

export function getAggregates<T extends TableName>(..._: T[]) {
  // prettier-ignore
  const functionNames = ['count', 'sum', 'avg', 'min', 'max', 'stringAgg', 'arrayAgg', 'jsonAgg', 'jsonbAgg', 'jsonObjectAgg', 'jsonbObjectAgg', 'boolAnd', 'boolOr', 'variance', 'varPop', 'varSamp', 'stddev', 'stddevPop', 'stddevSamp', 'percentileCont', 'percentileDisc', 'mode', 'covarPop', 'covarSamp', 'corr', 'regrSlope', 'regrIntercept', 'regrCount', 'regrR2'] as const
  const functionEntries = functionNames.map(getEntry)
  return Object.fromEntries(functionEntries) as Record<
    (typeof functionNames)[number],
    <U extends string = Column<T>>(...columns: U[]) => `$$${string}`
  >
}

function getEntry(name: string) {
  return [
    name,
    (...inputs: string[]) => {
      const expressions = inputs.map((input) => input.split('.'))
      const joined = expressions.map(([_, right]) => `%I${right ? '.%I' : ''}`).join(', ')
      return format(
        `$$${snakeCase(name).toUpperCase()}(${joined.replaceAll('$$', '')})`,
        ...expressions.flat(),
      ).replaceAll(/""+/g, '"')
    },
  ]
}
