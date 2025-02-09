import { readFileSync } from 'fs'

export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropFunction(
    'nanoid_optimized',
    [{ type: 'int4' }, { type: 'text' }, { type: 'int4' }, { type: 'int4' }],
    { ifExists: true },
  )
  pgm.dropFunction(
    'nanoid',
    [{ type: 'int4' }, { type: 'text' }, { type: 'float8' }],
    { ifExists: true },
  )
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  const script = readFileSync('migrations/scripts/nanoid.sql', {
    encoding: 'utf-8',
  })
  pgm.sql(script)
}
