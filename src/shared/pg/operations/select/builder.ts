import { format } from 'node-pg-format'
import { format as sqlPrettier } from 'sql-formatter'

import type { Column, Operator, TableName } from '../../types'

import { baseQuery } from '../../queries'

export type Method =
  | 'execute'
  | 'groupBy'
  | 'having'
  | 'havingGroupEnd'
  | 'havingGroupStart'
  | 'join'
  | 'limit'
  | 'offset'
  | 'orderBy'
  | 'toString'
  | 'where'
  | 'whereGroupEnd'
  | 'whereGroupStart'
type Join = 'full' | 'inner' | 'left' | 'right'
type NextOperator = 'and' | 'or' | undefined

export function buildQuery<T extends TableName, M extends Method>(
  base: string,
  includes: M[],
  lastMethod: Method | undefined,
  values: unknown[],
) {
  type ReturnMethods<R extends keyof typeof methods> = Pick<typeof methods, R>

  const groupByIncludes: Method[] = ['execute', 'toString', 'offset', 'orderBy', 'limit', 'having']
  const havingGroupEndIncludes: Method[] = ['execute', 'toString', 'havingGroupStart', 'having']
  const havingGroupStartIncludes: Method[] = ['toString', 'having']
  const havingIncludes: Method[] = ['execute', 'toString', 'orderBy', 'having', 'havingGroupStart', 'havingGroupEnd']
  const limitIncludes: Method[] = ['execute', 'toString', 'offset']
  const offsetIncludes: Method[] = ['execute', 'toString']
  const orderByIncludes: Method[] = ['execute', 'toString', 'offset', 'limit', 'orderBy']
  const whereGroupStartIncludes: Method[] = ['where', 'whereGroupEnd', 'toString']
  const joinIncludes: Method[] = [
    'execute',
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
    'execute',
    'groupBy',
    'limit',
    'offset',
    'orderBy',
    'toString',
    'where',
    'whereGroupStart',
  ]
  const whereIncludes: Method[] = [
    'execute',
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

  const toString = () => sqlPrettier(`${clearBase(true)};`, { language: 'postgresql' })
  const execute = <Q = null>() => baseQuery<T, Q>(toString(), values)

  const whereGroupStart = <C extends string = Column<T>>(
    lhs: C | Exclude<`${T}.${C}`, `${T}.`>,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
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

  const whereGroupEnd = <C extends string = Column<T>>(
    lhs: C | Exclude<`${T}.${C}`, `${T}.`>,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
    const isBaseDirty = shouldClearBase(['where', 'whereGroupStart'])
    const hasKeyword = / WHERE /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1}) ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, whereGroupEndIncludes, 'whereGroupEnd', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'execute' | 'toString' | 'where' | 'whereGroupStart'>
  }

  const where = <C extends string = Column<T>>(
    lhs: C,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
    const isBaseDirty = shouldClearBase(['where', 'whereGroupStart', 'whereGroupEnd'])
    const hasKeyword = / WHERE /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, whereIncludes, 'where', [...values, rhs]) as unknown as ReturnMethods<
      'execute' | 'groupBy' | 'limit' | 'offset' | 'orderBy' | 'toString' | 'where' | 'whereGroupStart'
    >
  }

  const groupBy = <N extends TableName = T, _ extends string = Column<N>>(...groups: Column<N>[]) => {
    const raw = `${clearBase(true)}${groups.length > 0 ? ` GROUP BY ${groups.map(() => '%I').join(', ')}` : ''}`
    const queryString = format(raw, ...groups.map((v) => (Array.isArray(v) ? v[0] : v))).replace(/ ,$/, '')
    return buildQuery(queryString, groupByIncludes, 'groupBy', [...values]) as unknown as ReturnMethods<
      'execute' | 'limit' | 'offset' | 'orderBy' | 'toString'
    >
  }

  const havingGroupStart = <C extends string = Column<T>>(
    lhs: C | Exclude<`${T}.${C}`, `${T}.`>,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
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

  const havingGroupEnd = <C extends string = Column<T>>(
    lhs: C | Exclude<`${T}.${C}`, `${T}.`>,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
    const isBaseDirty = shouldClearBase(['having', 'havingGroupStart'])
    const hasKeyword = / HAVING /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasKeyword ? '' : ' WHERE'} %I %s $${lastParameterCount + 1}) ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, havingGroupEndIncludes, 'havingGroupEnd', [
      ...values,
      rhs,
    ]) as unknown as ReturnMethods<'execute' | 'having' | 'havingGroupStart' | 'toString'>
  }

  const having = <C extends string = Column<T>>(
    lhs: C | Exclude<`${T}.${C}`, `${T}.`>,
    op: Operator,
    rhs: unknown,
    nextOperator: NextOperator = 'and',
  ) => {
    const isBaseDirty = shouldClearBase(['having', 'havingGroupStart', 'havingGroupEnd'])
    const hasHaving = / HAVING /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(isBaseDirty)}${hasHaving ? '' : ' HAVING'} %I %s${op.includes('null') ? '' : ` $${lastParameterCount + 1}`} ${nextOperator.toUpperCase()}`
    const queryString = format(raw, lhs, op.toUpperCase(), rhs)
    return buildQuery(queryString, havingIncludes, 'having', [...values, rhs]) as unknown as ReturnMethods<
      'execute' | 'having' | 'orderBy' | 'toString'
    >
  }

  const join = <A extends TableName, B extends TableName, C extends string = Column<A>, D extends string = Column<B>>(
    target: [C, string] | C,
    op: Operator,
    source: D,
    type: Join = 'inner',
  ) => {
    const _target = Array.isArray(target) ? [target[0].split('.'), target[1]] : target.split('.')
    const _source = source.split('.')
    const isBaseDirty = shouldClearBase(['join'])
    const raw = `${clearBase(isBaseDirty)} ${type.toUpperCase()} JOIN %I${_target[2] ? ' %I' : ''} ON %I.%I %s %I.%I`
    const queryString = _target[2]
      ? format(raw, _target[0], _target[2], _target[0], _target[1], op, _source[0], _source[1])
      : format(raw, _target[0], _target[0], _target[1], op, _source[0], _source[1])
    return buildQuery(queryString.replaceAll(/""+/g, '"'), joinIncludes, 'join', [
      ...values,
    ]) as unknown as ReturnMethods<
      'execute' | 'groupBy' | 'join' | 'limit' | 'offset' | 'orderBy' | 'toString' | 'where' | 'whereGroupStart'
    >
  }

  const offset = (value: number) => {
    const hasKeyword = / OFFSET /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' OFFSET'} $${lastParameterCount + 1}`
    const queryString = format(raw, value)
    return buildQuery(queryString, offsetIncludes, 'offset', [...values, value]) as unknown as ReturnMethods<
      'execute' | 'toString'
    >
  }

  const limit = (value: number) => {
    const hasKeyword = / LIMIT /.test(base)
    const lastParameterCount = getLastParameterCount(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' LIMIT'} $${lastParameterCount + 1}`
    const queryString = format(raw, value)
    return buildQuery(queryString, limitIncludes, 'limit', [...values, value]) as unknown as ReturnMethods<
      'execute' | 'offset' | 'toString'
    >
  }

  const orderBy = <C extends string = Column<T>>(column: C, direction: 'asc' | 'desc' = 'asc') => {
    const hasKeyword = / ORDER BY /.test(base)
    const raw = `${clearBase(true)}${hasKeyword ? '' : ' ORDER BY'} %I %I,`
    const queryString = format(raw, column, direction.toUpperCase())
    return buildQuery(queryString, orderByIncludes, 'orderBy', [...values]) as unknown as ReturnMethods<
      'execute' | 'limit' | 'offset' | 'orderBy' | 'toString'
    >
  }

  const methods = {
    execute,
    groupBy,
    having,
    havingGroupEnd,
    havingGroupStart,
    join,
    limit,
    offset,
    orderBy,
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
