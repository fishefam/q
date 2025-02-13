import { format } from 'node-pg-format'

import type { Column, Operator, TableName } from '../../types'

import { basePgQuery } from '../../base-query'

export type Method =
  | 'groupBy'
  | 'having'
  | 'havingGroupEnd'
  | 'havingGroupStart'
  | 'join'
  | 'limit'
  | 'offset'
  | 'orderBy'
  | 'query'
  | 'toString'
  | 'where'
  | 'whereGroupEnd'
  | 'whereGroupStart'
type Join = 'full' | 'inner' | 'left' | 'right'
type NextOperator = 'and' | 'or'

export function buildQuery<T extends TableName, M extends Method>(
  base: string,
  includes: M[],
  lastMethod: Method | undefined,
  values: unknown[],
) {
  type ReturnMethods<T extends keyof typeof methods> = Pick<typeof methods, T>

  const groupByIncludes: Method[] = ['query', 'toString', 'offset', 'orderBy', 'limit', 'having']
  const havingGroupEndIncludes: Method[] = ['query', 'toString', 'havingGroupStart', 'having']
  const havingGroupStartIncludes: Method[] = ['toString', 'having']
  const havingIncludes: Method[] = ['query', 'toString', 'orderBy', 'having', 'havingGroupStart', 'havingGroupEnd']
  const limitIncludes: Method[] = ['query', 'toString', 'offset']
  const offsetIncludes: Method[] = ['query', 'toString']
  const orderByIncludes: Method[] = ['query', 'toString', 'offset', 'limit', 'orderBy']
  const whereGroupStartIncludes: Method[] = ['where', 'whereGroupEnd', 'toString']
  const joinIncludes: Method[] = [
    'query',
    'groupBy',
    'join',
    'limit',
    'offset',
    'orderBy',
    'toString',
    'where',
    'whereGroupStart',
  ]
  const whereGroupEndIncludes: Method[] = [
    'query',
    'groupBy',
    'limit',
    'offset',
    'orderBy',
    'toString',
    'where',
    'whereGroupStart',
  ]
  const whereIncludes: Method[] = [
    'query',
    'groupBy',
    'limit',
    'offset',
    'orderBy',
    'toString',
    'where',
    'whereGroupEnd',
    'whereGroupStart',
  ]

  const shouldClearBase = (list: Method[]) => !!lastMethod && !list.includes(lastMethod)
  const clearBase = (flag: boolean) => (flag ? base.replace(/( and| or|,)$/i, '') : base)

  const toString = () => `${clearBase(true)};`
  const query = () => basePgQuery<T>(toString(), values)

  const whereGroupStart = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['where', 'whereGroupEnd'])
    const hasKeyword = / WHERE /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} (%I %s $${lastParameterCount + 1} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, whereGroupStartIncludes, 'whereGroupStart', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'toString' | 'where' | 'whereGroupEnd'>
  }

  const whereGroupEnd = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['where', 'whereGroupStart'])
    const hasKeyword = / WHERE /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1}) ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, whereGroupEndIncludes, 'whereGroupEnd', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'query' | 'toString' | 'where' | 'whereGroupStart'>
  }

  const where = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['where', 'whereGroupStart', 'whereGroupEnd'])
    const hasKeyword = / WHERE /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, whereIncludes, 'where', [...values, rhs]) as unknown as ReturnMethods<
      'groupBy' | 'limit' | 'offset' | 'orderBy' | 'query' | 'toString' | 'where' | 'whereGroupStart'
    >
  }

  const groupBy = <C = Column<T>>(...groups: C[]) => {
    const raw = `${clearBase(true)}${groups.length > 0 ? ` GROUP BY ${groups.map(() => '%I').join(', ')}` : ''}`
    const queryString = format(raw, ...groups.map((v) => (Array.isArray(v) ? v[0] : v))).replace(/ ,$/, '')
    return buildQuery(queryString, groupByIncludes, 'groupBy', [...values]) as unknown as ReturnMethods<
      'limit' | 'offset' | 'orderBy' | 'query' | 'toString'
    >
  }

  const havingGroupStart = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['having', 'havingGroupEnd'])
    const hasKeyword = / HAVING /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} (%I %s $${lastParameterCount + 1} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, havingGroupStartIncludes, 'havingGroupStart', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'having' | 'toString'>
  }

  const havingGroupEnd = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['having', 'havingGroupStart'])
    const hasKeyword = / HAVING /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1}) ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, havingGroupEndIncludes, 'havingGroupEnd', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'having' | 'havingGroupStart' | 'query' | 'toString'>
  }

  const having = <C = Column<T>>(lhs: C, op: Operator, rhs: unknown, nextOperator: NextOperator = 'and') => {
    const isBaseDirty = shouldClearBase(['having', 'havingGroupStart', 'havingGroupEnd'])
    const hasHaving = / HAVING /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasHaving ? '' : ' HAVING'} %I %s${op.includes('null') ? '' : ` $${lastParameterCount + 1}`} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, havingIncludes, 'having', [...values, rhs]) as unknown as ReturnMethods<
      'having' | 'orderBy' | 'query' | 'toString'
    >
  }

  const join = <A extends TableName, B extends TableName, C = Column<A>, D = Column<B>>(
    target: [A, C, string] | [A, C],
    op: Operator,
    source: [B, D],
    nextOperator: NextOperator = 'and',
    type: Join = 'inner',
  ) => {
    const isBaseDirty = shouldClearBase(['join'])
    const hasKeyword = / JOIN /.test(base)
    const raw = `${clearBase(isBaseDirty)} ${type.toUpperCase()}${hasKeyword ? '' : ' JOIN'} %I${target[2] ? ' %I' : ''} ON %I.%I %s %I.%I ${nextOperator.toUpperCase()}`
    const queryString = target[2]
      ? format(raw, target[0], target[2], target[0], target[1], op, source[0], source[1], nextOperator)
      : format(raw, target[0], target[0], target[1], op, source[0], source[1], nextOperator)
    return buildQuery(queryString, joinIncludes, 'join', [...values]) as unknown as ReturnMethods<
      'groupBy' | 'join' | 'limit' | 'offset' | 'orderBy' | 'query' | 'toString'
    >
  }

  const offset = (value: number) => {
    const hasKeyword = / OFFSET /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' OFFSET'} $${lastParameterCount + 1}`
    const queryString = format(raw, value)
    return buildQuery(queryString, offsetIncludes, 'offset', [...values, value]) as unknown as ReturnMethods<
      'query' | 'toString'
    >
  }

  const limit = (value: number) => {
    const hasKeyword = / LIMIT /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' LIMIT'} $${lastParameterCount + 1}`
    const queryString = format(raw, value)
    return buildQuery(queryString, limitIncludes, 'limit', [...values, value]) as unknown as ReturnMethods<
      'offset' | 'query' | 'toString'
    >
  }

  const orderBy = <C = Column<T>>(column: C, direction: 'asc' | 'desc' = 'asc') => {
    const hasKeyword = / ORDER BY /.test(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' ORDER BY'} %I %I,`
    const queryString = format(raw, column, direction.toUpperCase())
    return buildQuery(queryString, orderByIncludes, 'orderBy', [...values]) as unknown as ReturnMethods<
      'limit' | 'offset' | 'orderBy' | 'query' | 'toString'
    >
  }

  const methods = {
    groupBy,
    having,
    havingGroupEnd,
    havingGroupStart,
    join,
    limit,
    offset,
    orderBy,
    query,
    toString,
    where,
    whereGroupEnd,
    whereGroupStart,
  }
  const excludes = includes.length > 0 ? Object.keys(methods).filter((key) => !includes.includes(key as never)) : []

  for (const method of excludes) {
    type Proto = { __proto__: { toString: undefined } }
    if (method === 'toString') (methods as unknown as Proto).__proto__.toString = undefined
    delete methods[method as never]
  }

  return methods
}

function getLastParameterCount(query: string) {
  const lastMatch = query.match(/\$\d+/g)?.at(-1)
  const lastParameter = lastMatch?.replace('$', '') ?? '0'
  return Number.parseInt(lastParameter)
}
