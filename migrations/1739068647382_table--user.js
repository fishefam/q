export const shorthands = undefined

const table = 'user'

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
    alias: { type: 'text', unique: true },
    cms_access: { default: true, notNull: true, type: 'boolean' },
    first_name: { default: '', notNull: true, type: 'text' },
    id: {
      notNull: true,
      primaryKey: true,
      type: 'text',
    },
    last_name: { default: '', notNull: true, type: 'text' },
    middle_name: { type: 'text' },
    profile_image: { type: 'text' },
    role: { notNull: true, type: 'text' },
  })
}
