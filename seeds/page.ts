import { createArray, lorem } from '@/shared/utilities'
import { insert, select } from '@/shared/utilities/pg'

export async function seed() {
  const languages = await select('language', ['id'], {
    limit: 1,
    where: [['code', '=', 'en']],
  })
  const language_id = languages.at(0)?.id ?? ''
  const data = createArray(5).map(() => ({
    language_id,
    path: '/' + lorem().generateWords(3).replaceAll(' ', '-'),
  }))

  insert('page', data)
}
