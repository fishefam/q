export const shorthands = undefined

const table = 'node_resizable'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropTable(table, { cascade: true, ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(table, {
    direction: { notNull: true, type: '"Direction"' },
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    keep_on_site: { default: false, notNull: true, type: 'boolean' },
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    size: { default: '{}', notNull: true, type: 'numeric(15,10)[]' },
  })
}
