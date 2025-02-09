export const shorthands = undefined

const table = 'attribute'
const referenceConstaint = 'attribute_node_id_version_fk'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropConstraint(table, referenceConstaint)
  pgm.dropTable(table, { ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(table, {
    id: { primaryKey: true, type: 'text' },
    is_css: { default: false, notNull: true, type: 'boolean' },
    key: { notNull: true, type: 'text' },
    node_id: { notNull: true, type: 'text' },
    node_version: { notNull: true, type: 'int' },
    value: { type: 'text' },
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
