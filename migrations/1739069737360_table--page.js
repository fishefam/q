export const shorthands = undefined

const table = 'page'
const pathFormatConstraint = 'path_format_check'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
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
    id: {
      default: pgm.func('nanoid()'),
      onDelete: 'CASCADE',
      primaryKey: true,
      type: 'text',
    },
    name: { comment: 'Friendly name to represent page in CMS', type: 'text' },
    path: { type: 'text', unique: true },
    title: { type: 'text' },
    language: { references: 'language(id)', type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    require_auth: { default: false, notNull: true, type: 'boolean' },
    tags: { comment: 'hashtag tags for page', default: '{}', type: 'text[]' },
    created_at: { default: now, notNull: true, type: 'timestamp' },
    created_by: { notNull: true, type: 'text' },
    modified_at: { default: now, type: 'timestamp' },
    modified_by: { type: 'text' },
  })

  pgm.addConstraint(table, pathFormatConstraint, "CHECK (path ~ '^/.*[^/]$')")
}
