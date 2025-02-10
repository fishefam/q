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
    id: {
      default: pgm.func('nanoid()'),
      onDelete: 'CASCADE',
      primaryKey: true,
      type: 'text',
    },
    page_id: { notNull: true, references: 'page(id)', type: 'text' },
    mount_id: { references: `${table}(id)`, type: 'text' },
    order: { default: 0, notNull: true, type: 'int' },
    name: { comment: 'Friendly name to represent node in CMS', type: 'text' },
    language: { notNull: true, references: 'language(id)', type: 'text' },
    module_url: { type: 'text' },
    class_name: { type: 'text' },
    css: { type: 'text' },
    is_active: { default: true, notNull: true, type: 'boolean' },
    require_auth: { default: false, notNull: true, type: 'boolean' },
    tag_name: { default: 'div', notNull: true, type: 'text' },
    tags: {
      comment: 'hashtag tags for node',
      default: '{}',
      notNull: true,
      type: 'text[]',
    },
    created_at: { default: now, notNull: true, type: 'timestamp' },
    created_by: { notNull: true, type: 'text' },
    modified_at: { default: now, type: 'timestamp' },
    modified_by: { type: 'text' },
  })
}
