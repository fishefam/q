/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('test_table', {
    body: { notNull: true, type: 'text' },
    create_at: {
      default: pgm.func('current_timestamp'),
      notNull: true,
      type: 'timestamp',
    },
    id: 'id',
    user_id: {
      notNull: true,
      type: 'integer',
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('test_table', { cascade: true })
}
