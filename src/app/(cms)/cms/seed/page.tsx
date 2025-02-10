import * as db from '@db'
import { Pool } from 'pg'

import { Seed } from './seed'

export default async function Page() {
  const client = new Pool({ connectionString: process.env.DATABASE_URL })
  const { seedColumns, ...dbSchema } = db
  const dbTables = Object.values(dbSchema)
  const makeQuery = (table: string) => client.query(`SELECT * FROM ${table}`)
  const queries = dbTables.map(({ tableName }) => makeQuery(tableName))
  const results = await Promise.all(queries)
  const tables = results.map(({ rows }, i) => {
    const columns = dbTables[i].columns
      .filter((column) =>
        seedColumns.map(({ field }) => field).includes(column),
      )
      .map((field) => ({
        field,
        type: seedColumns.find((seedColumn) => seedColumn.field === field)
          ?.type,
      }))
    return { columns, rows, tableName: dbTables[i].tableName }
  })

  return <Seed data={tables} />
}
