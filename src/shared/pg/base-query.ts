import { type DatabaseError, Pool } from 'pg'

import type { Result, Row, TableName } from './types'

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function basePgQuery<T extends TableName>(
  query: string,
  values: unknown[],
  options?: { closePool?: boolean },
) {
  const result = [undefined, undefined] as unknown as Result<T>
  try {
    const { rows } = await pool.query<Row<T>>(query, values)
    result[1] = rows
  } catch (error) {
    const { detail, message } = <DatabaseError>error
    result[0] = { detail, message }
  } finally {
    if (options?.closePool) await pool.end()
    return result
  }
}
