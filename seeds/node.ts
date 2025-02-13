import type { NodeInput } from '@database'

import { insert, select } from '@/shared/pg'
import { createArray } from '@/shared/utilities'
import { nanoid } from 'nanoid'

export const order = 2

export async function seed() {
  const languageQuery = select('language', 'id').where('code', '=', 'en').query()
  const pageQuery = select('page', 'id').limit(1).query()
  const userInfoQuery = select('user_info', 'id').limit(1).query()
  const results = await Promise.all([languageQuery, pageQuery, userInfoQuery])
  const [, pages] = results[1]
  const [, userInfos] = results[2]
  const page_id = (pages ?? []).at(0)?.id ?? ''
  const created_by = (userInfos ?? []).at(0)?.id ?? ''
  const baseData: NodeInput = { created_by, order: 0, page_id }
  const data = createArray(11).map(() => ({ ...baseData, id: nanoid() }))

  mountElements(data)
  setOrders(data)

  const [error] = await insert('node', data)
  const errorMessage = `Error in node table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node` table'

  console.log(error ? errorMessage : successMessage)
}

function mountElements(data: NodeInput[]) {
  data[0].mount_id = undefined
  data[1].mount_id = data[0].id
  data[2].mount_id = data[0].id
  data[3].mount_id = data[2].id
  data[4].mount_id = data[2].id
  data[5].mount_id = data[4].id
  data[6].mount_id = data[4].id
  data[7].mount_id = data[1].id
  data[8].mount_id = data[3].id
  data[9].mount_id = data[5].id
  data[10].mount_id = data[6].id
}

function setOrders(data: NodeInput[]) {
  data[2].order = 1
  data[4].order = 1
  data[6].order = 1
}
