export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropTable('page', { cascade: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(
    'page',
    {
      created_at: {
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
        type: 'timestamp',
      },
      created_by: {
        notNull: true,
        type: 'text',
      },
      id: {
        default: pgm.func('nanoid()'),
        notNull: true,
        onDelete: 'CASCADE',
        primaryKey: true,
        type: 'text',
      },
      is_active: { default: true, notNull: true, type: 'boolean' },
      modified_at: {
        default: pgm.func('CURRENT_TIMESTAMP'),
        type: 'timestamp',
      },
      modified_by: { type: 'text' },
      path: { notNull: true, type: 'text', unique: true },
      require_auth: { default: false, notNull: true, type: 'boolean' },
    },
    { ifNotExists: true },
  )
  pgm.addConstraint('page', 'path_format_check', "CHECK (path ~ '^/.*[^/]$')")
}
