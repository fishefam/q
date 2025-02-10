import type { Where } from '@/shared/pg/types'
import type { NodeInput } from '@db'

import { insert, select } from '@/shared/pg'
import { createArray } from '@/shared/utilities'

export const order = 1

export async function seed() {
  const languageWhere: Where<'language'>[] = [['code', '=', 'en']]
  const languageQuery = select('language', ['id'], { where: languageWhere })
  const pageQuery = select('page', ['id'], { limit: 1 })
  const results = await Promise.all([languageQuery, pageQuery])
  const [, languages] = results[0]
  const [, pages] = results[1]
  const language_id = (languages ?? []).at(0)?.id ?? ''
  const page_id = (pages ?? []).at(0)?.id ?? ''
  const data = createArray(5).map<NodeInput>(() => ({ language_id, page_id }))
  const [error] = await insert('node', data)
  const errorMessage = `Error in page table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node` table'
  console.log(error ? errorMessage : successMessage)
  return
}
