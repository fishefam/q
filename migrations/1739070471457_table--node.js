export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropTable('node', { cascade: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(
    'node',
    {
      attributes: { type: 'jsonb' },
      class_name: { type: 'text' },
      created_at: {
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
        type: 'timestamp',
      },
      created_by: { notNull: true, type: 'text' },
      direction: { default: 'vertical', notNull: true, type: '"Direction"' },
      id: {
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
      mount_id: { references: '"node"(id)', type: 'text' },
      page_id: { notNull: true, references: '"page"(id)', type: 'text' },
      require_auth: { default: false, notNull: true, type: 'boolean' },
      size: { type: 'numeric(15,10)' },
      style: { type: 'jsonb' },
      tag_name: { type: 'text' },
      text: { type: 'text' },
    },
    { ifNotExists: true },
  )
}
