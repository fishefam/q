export const shorthands = undefined

const table = 'page_metadata'

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
    content: { default: '', notNull: true, type: 'text' },
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    name: { notNull: true, type: 'text', unique: true },
    page_id: { notNull: true, references: 'page(id)', type: 'text' },
  })
}
