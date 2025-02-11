import { readFileSync, writeFileSync } from 'node:fs'
import { format } from 'prettier'

const databaseFile = 'database.ts'
const content = readFileSync(databaseFile, { encoding: 'utf8' })
const fixedContent = content.replaceAll(/^const /gim, 'export const ')
const linterPattern = /(\/\* tslint:disable \*\/)|(\/\* eslint-disable \*\/)/gm
const postgresPattern = / \* \$ pg-to-ts generate.*/g
const linterStripped = fixedContent.replaceAll(linterPattern, '')
const strippedContent = linterStripped.replaceAll(postgresPattern, '')
const prettied = await format(strippedContent, { parser: 'typescript' })

writeFileSync(databaseFile, prettied, { encoding: 'utf8' })
