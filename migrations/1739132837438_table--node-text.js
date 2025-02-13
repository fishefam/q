export const shorthands = undefined

const table = 'node_text'

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
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    language_id: { notNull: true, references: 'language(id)', type: 'text' },
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    text: { notNull: true, type: 'text' },
  })
}
