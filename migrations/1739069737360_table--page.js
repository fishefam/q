export const shorthands = undefined

const table = 'page'
const pathFormatConstraint = 'path_format_check'
const uniqueActivePathIndex = 'unique_active_path'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropIndex(table, 'path', { ifExists: true, name: uniqueActivePathIndex })
  pgm.dropConstraint(table, pathFormatConstraint, { ifExists: true })
  pgm.dropTable(table, { cascade: true, ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  const now = pgm.func('CURRENT_TIMESTAMP')

  pgm.createTable(table, {
    created_at: { default: now, notNull: true, type: 'timestamp' },
    created_by: { notNull: true, type: 'text' },
    id: {
      default: pgm.func('nanoid()'),
      notNull: true,
      onDelete: 'CASCADE',
      primaryKey: true,
      type: 'text',
    },
    is_active: { default: true, notNull: true, type: 'boolean' },
    modified_at: { default: now, type: 'timestamp' },
    modified_by: { type: 'text' },
    name: { type: 'text' },
    path: { type: 'text', unique: true },
    require_auth: { default: false, notNull: true, type: 'boolean' },
  })

  pgm.createIndex(table, 'path', {
    name: uniqueActivePathIndex,
    where: 'is_active = TRUE',
  })

  pgm.addConstraint(table, pathFormatConstraint, "CHECK (path ~ '^/.*[^/]$')")
}
