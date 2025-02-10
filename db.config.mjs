import { readFileSync, writeFileSync } from 'fs'

const dbFile = 'db.ts'
const content = readFileSync(dbFile, { encoding: 'utf-8' })
const fixedContent = content.replaceAll(/^const /gim, 'export const ')

writeFileSync(dbFile, fixedContent, { encoding: 'utf-8' })
