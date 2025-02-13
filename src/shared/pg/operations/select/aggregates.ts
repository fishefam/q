import { format } from 'node-pg-format'

export function getEntryArray<T>(template: Record<string, T>) {
  const entries = Object.entries(template).flat()
  const placeholders = entries.map(() => '%I')
  const query = `jsonb_agg(jsonb_build_object(${placeholders}))`
  return format(query, ...entries)
}
