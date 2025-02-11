export const shorthands = undefined

const table = 'user_info'
const aliasConstraint = 'user_info_alias_key'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropConstraint(table, aliasConstraint)
  pgm.dropTable(table, { ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable(table, {
    id: { notNull: true, primaryKey: true, type: 'text' },
    first_name: { default: '', notNull: true, type: 'text' },
    middle_name: { type: 'text' },
    last_name: { default: '', notNull: true, type: 'text' },
    alias: { type: 'text', unique: true },
    profile_image: { type: 'text' },
    cms_access: { default: true, notNull: true, type: 'boolean' },
    role: { notNull: true, type: 'text' },
  })
}
