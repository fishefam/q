import { readFileSync, writeFileSync } from 'fs'

const dbFile = 'db.ts'
const content = readFileSync(dbFile, { encoding: 'utf-8' })
const fixedContent = content
  .replaceAll(/^const /gim, 'export const ')
  .replace('export const tables', 'const tables')
  .replace('export const pgmigrations', 'const pgmigrations')
const seedColumns = fixedContent
  .match(/^\s*.*:\s*(string|number|boolean)[^\[]/gim)
  .map((value) =>
    value.split(':').map((value) => value.replaceAll(/[\?;]/gi, '').trim()),
  )
const uniqueSeedColumns = [
  ...new Set(
    seedColumns.map(
      ([field, type]) => `\n  { field: '${field}', type: '${type}'}`,
    ),
  ),
]
const extraContent = `\nexport const seedColumns = [${uniqueSeedColumns.join(', ')}
]`

writeFileSync(dbFile, fixedContent + extraContent, {
  encoding: 'utf-8',
})
