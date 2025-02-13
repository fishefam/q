import { type DatabaseError, Pool } from 'pg'

import type { Result, Row, TableName } from './types'

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function baseQuery<T extends TableName, Q>(query: string, values: unknown[]) {
  const result = [undefined, undefined] as unknown as Result<T, Q>
  try {
    const { rows } = await pool.query<Row<T>>(query, values)
    result[1] = rows as never
  } catch (error) {
    const { detail, message } = <DatabaseError>error
    result[0] = { detail, message }
  } finally {
    return result
  }
}

export async function runTransaction<R extends Result<TableName, unknown>[]>(
  ...queries: ReturnType<typeof baseQuery>[]
) {
  const client = await pool.connect()
  const resultList = []
  try {
    client.query('BEGIN')
    const list = await Promise.all(queries)
    for (const item of list) resultList.push(item)
    client.query('COMMIT')
  } catch {
    client.query('ROLLBACK')
  } finally {
    client.release()
    return resultList as unknown as R
  }
}
