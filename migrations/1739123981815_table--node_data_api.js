export const shorthands = undefined

const table = 'node_data_api'

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
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    api: { notNull: true, type: 'text' },
  })
}
