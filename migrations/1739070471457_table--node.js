export const shorthands = undefined

const table = 'node'

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
  const now = pgm.func('CURRENT_TIMESTAMP')

  pgm.createTable(table, {
    class_name: { type: 'text' },
    created_at: { default: now, notNull: true, type: 'timestamp' },
    created_by: { notNull: true, type: 'text' },
    css: { type: 'text' },
    id: {
      default: pgm.func('nanoid()'),
      onDelete: 'CASCADE',
      primaryKey: true,
      type: 'text',
    },
    is_active: { default: true, notNull: true, type: 'boolean' },
    language: { notNull: true, references: 'language(id)', type: 'text' },
    modified_at: { default: now, type: 'timestamp' },
    modified_by: { type: 'text' },
    module_url: { type: 'text' },
    mount_id: { references: `${table}(id)`, type: 'text' },
    name: { comment: 'Friendly name to represent node in CMS', type: 'text' },
    order: { default: 0, notNull: true, type: 'int' },
    page_id: { notNull: true, references: 'page(id)', type: 'text' },
    require_auth: { default: false, notNull: true, type: 'boolean' },
    tag_name: { default: 'div', notNull: true, type: 'text' },
    tags: {
      comment: 'hashtag tags for node',
      default: '{}',
      notNull: true,
      type: 'text[]',
    },
  })
}
