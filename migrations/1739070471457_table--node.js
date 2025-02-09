export const shorthands = undefined

const table = 'node'
const incrementVersionFunction = 'increment_version'
const incrementVersionTrigger = 'node_version_increment'
const versionUniqueConstraint = 'node_id_version_unique'
const referenceConstraint = 'node_mount_id_version_fk'

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropConstraint(table, versionUniqueConstraint, { ifExists: true })
  pgm.dropConstraint(table, referenceConstraint, { ifExists: true })
  pgm.dropTrigger(table, incrementVersionTrigger, { ifExists: true })
  pgm.dropFunction(incrementVersionFunction, [], { ifExists: true })
  pgm.dropTable(table, { cascade: true, ifExists: true })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  const now = pgm.func('CURRENT_TIMESTAMP')

  pgm.createTable(
    table,
    {
      class_name: { type: 'text' },
      created_at: { default: now, notNull: true, type: 'timestamp' },
      created_by: { notNull: true, type: 'text' },
      id: { notNull: true, type: 'text' },
      is_active: { default: true, notNull: true, type: 'boolean' },
      modified_at: { default: now, type: 'timestamp' },
      modified_by: { type: 'text' },
      mount_id: { type: 'text' },
      mount_version: { type: 'int' },
      name: { type: 'text' },
      page_id: { notNull: true, references: 'page(id)', type: 'text' },
      require_auth: { default: false, notNull: true, type: 'boolean' },
      style: { type: 'jsonb' },
      tag_name: { type: 'text' },
      text: { type: 'text' },
      version: { default: 0, notNull: true, type: 'int' },
    },
    { constraints: { primaryKey: ['id', 'version'] } },
  )

  pgm.addConstraint(table, versionUniqueConstraint, {
    unique: ['id', 'version'],
  })

  pgm.addConstraint(table, referenceConstraint, {
    foreignKeys: {
      columns: ['mount_id', 'mount_version'],
      onDelete: 'CASCADE',
      references: 'node(id, version)',
    },
  })

  pgm.sql(`
    CREATE OR REPLACE FUNCTION ${incrementVersionFunction}()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.version := COALESCE((SELECT MAX(version) FROM ${table} WHERE id = NEW.id), 0) + 1;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  pgm.sql(`
    CREATE TRIGGER ${incrementVersionTrigger}
    BEFORE INSERT ON ${table}
    FOR EACH ROW
    EXECUTE FUNCTION ${incrementVersionFunction}();
  `)
}
