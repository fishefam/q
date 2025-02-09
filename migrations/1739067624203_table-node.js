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
  pgm.addType('direction', ['horizontal', 'vertical'])
  pgm.createTable(
    'node',
    {
      attributes: { type: 'jsonb' },
      class_name: { type: 'text' },
      direction: { default: 'vertical', notNull: true, type: 'direction' },
      id: {
        notNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
        type: 'text',
      },
      mount_id: {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: '"node"(id)',
        type: 'text',
      },
      size: { type: 'numeric(15,10)' },
      style: { type: 'jsonb' },
      tag_name: { type: 'text' },
      text: { type: 'text' },
    },
    { ifNotExists: true },
  )
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('node', { cascade: true })
}
