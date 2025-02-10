import Languages from 'language-list'
import { nanoid } from 'nanoid'

export const shorthands = undefined

const table = 'language'
const languages = new Languages()
const codes = languages.getLanguageCodes()
const languagesWithCodes = codes.map((code) => ({
  code,
  language: languages.getLanguageName(code),
}))

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropTable(table, { ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(table, {
    id: { default: pgm.func('nanoid(10)'), primaryKey: true, type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    code: { notNull: true, type: 'text', unique: true },
    language: { notNull: true, type: 'text', unique: true },
  })
  pgm.sql(`
    INSERT INTO ${table} (id, code, language, is_active) VALUES
    ${languagesWithCodes.map(({ code, language }) => `('${nanoid(10)}','${code}', '${language}', ${code === 'en' ? true : false})`)}
  `)
}
