export const shorthands = undefined

const table = 'node_state'
const nameConstraint = 'check_valid_js_name_constraint'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropConstraint(table, nameConstraint)
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
    name: { notNull: true, type: 'text', unique: true },
    node_id: { notNull: true, references: 'node(id)', type: 'text' },
    value: { type: 'jsonb' },
  })
  pgm.addConstraint(table, nameConstraint, {
    check: "name ~ '^[a-zA-Z_$][a-zA-Z0-9_$]*$'",
  })
}
