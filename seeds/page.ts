import type { Where } from '@/shared/pg/types'
import type { PageInput } from '@db'

import { insert, select } from '@/shared/pg'
import { createArray, lorem } from '@/shared/utilities'

export const order = 1

export async function seed() {
  const where: Where<'language'>[] = [['code', '=', 'en']]
  const languageQuery = select('language', ['id'], { where })
  const userInfoQuery = select('user_info', ['id'], { limit: 1 })
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
