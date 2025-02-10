import type { Where } from '@/shared/utilities/pg'

import { createArray, lorem } from '@/shared/utilities'
import { insert, select } from '@/shared/utilities/pg'

export const order = 0

export async function seed() {
  const where: Where<'language'>[] = [['code', '=', 'en']]
  const [, languages] = await select('language', ['id'], { where })
  const language_id = languages?.at(0)?.id ?? ''
  const data = createArray(5).map(() => {
    const path = '/' + lorem().generateWords(3).replaceAll(' ', '-')
    return { language_id, path }
  })
  const [error] = await insert('page', data)
  const errorMessage = `Error in page table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `page` table'
  console.log(error ? errorMessage : successMessage)
  return
}
