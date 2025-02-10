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
    id: { default: pgm.func('nanoid()'), primaryKey: true, type: 'text' },
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    url: { notNull: true, type: 'text' },
    order: { notNull: true, type: 'int' },
    cascade_depth: { type: 'int' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    require_auth: { default: false, notNull: true, type: 'boolean' },
    show_on_site: { default: true, notNull: true, type: 'boolean' },
  })
}
