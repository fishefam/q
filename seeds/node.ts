import type { Where } from '@/shared/pg/types'
import type { NodeInput } from '@database'

import { insert, select } from '@/shared/pg'
import { createArray } from '@/shared/utilities'

export const order = 2

export async function seed() {
  const languageWhere: Where<'language'>[] = [['code', '=', 'en']]
  const languageQuery = select('language', ['id'], { where: languageWhere })
  const pageQuery = select('page', ['id'], { limit: 1 })
  const userInfoQuery = select('user_info', ['id'], { limit: 1 })
  const results = await Promise.all([languageQuery, pageQuery, userInfoQuery])
  const [, languages] = results[0]
  const [, pages] = results[1]
  const [, userInfos] = results[2]
  const language_id = (languages ?? []).at(0)?.id ?? ''
  const page_id = (pages ?? []).at(0)?.id ?? ''
  const created_by = (userInfos ?? []).at(0)?.id ?? ''
  const baseData: NodeInput = { created_by, language_id, page_id }
  const data = createArray(5).map(() => baseData)
  const [error] = await insert('node', data)
  const errorMessage = `Error in page table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node` table'
  console.log(error ? errorMessage : successMessage)
}
