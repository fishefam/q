import type { PageInput } from '@database'

import { database, insert } from '@/shared/pg'
import { createArray, lorem } from '@/shared/utilities'

export const order = 1

export async function seed() {
  const languageQuery = database('language').select('id').where('code', '=', 'en').query()
  const userInfoQuery = database('user_info').select('id').limit(1).query()
  const queryResults = await Promise.all([languageQuery, userInfoQuery])
  const [, languages] = queryResults[0]
  const [, userInfo] = queryResults[1]
  const language_id = languages?.at(0)?.id ?? ''
  const created_by = userInfo?.at(0)?.id
  const baseData: Omit<PageInput, 'path'> = { created_by, language_id }
  const data = createArray(5).map(() => ({ ...baseData, path: getPath() }))
  const [error] = await insert('page', data)
  const errorMessage = `Error in page table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `page` table'
  console.log(error ? errorMessage : successMessage)
}

function getPath() {
  return '/' + lorem().generateWords(3).replaceAll(' ', '-')
}
