export const shorthands = undefined

const table = 'resizable'
const referenceConstaint = 'resizable_node_id_version_fk'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropConstraint(table, referenceConstaint)
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
    id: { primaryKey: true, type: 'text' },
    keep_on_site: { default: false, notNull: true, type: 'boolean' },
    node_id: { notNull: true, type: 'text' },
    node_version: { notNull: true, type: 'int' },
    sizes: { default: pgm.func("'[]'::jsonb"), notNull: true, type: 'jsonb' },
  })

  pgm.addConstraint(table, referenceConstaint, {
    foreignKeys: [
      {
        columns: ['node_id', 'node_version'],
        onDelete: 'CASCADE',
        references: 'node(id, version)',
      },
    ],
  })
}
