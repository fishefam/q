export const shorthands = undefined

const table = 'metadata'

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
    content: { type: 'text' },
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    name: { notNull: true, type: 'text', unique: true },
    page_id: { references: 'page(id)', type: 'text' },
  })
}
