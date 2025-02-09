export const shorthands = undefined

const table = 'node_plugin'

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
    cascade_depth: { type: 'int' },
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    keep_on_site: { default: true, notNull: true, type: 'boolean' },
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    order: { notNull: true, type: 'int' },
    require_auth: { default: false, notNull: true, type: 'boolean' },
    url: { notNull: true, type: 'text' },
  })
}
