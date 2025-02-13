import type { NodeTextInput } from '@database'

import { database, insert } from '@/shared/pg'
import { lorem } from '@/shared/utilities'

export const order = 3

export async function seed() {
  const languageQuery = database('language').select('id').where('', '=', 'en').query()
  const nodeQuery = database('node').select('id').query()
  const results = await Promise.all([languageQuery, nodeQuery])
  const [, languages] = results[0]
  const [, nodes] = results[1]
  const textNodes = nodes?.slice(7) ?? []
  const language_id = (languages ?? []).at(0)?.id ?? ''
  const baseData: NodeTextInput = { language_id, node_id: '', text: '' }
  const data = textNodes.map((node) => ({ ...baseData, node_id: node.id, text: lorem().generateWords(5) }))
  const [error] = await insert('node_text', data)
  const errorMessage = `Error in node_text table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node_text` table'
  console.log(error ? errorMessage : successMessage)
}
