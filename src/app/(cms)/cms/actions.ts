'use server'

import type { Where } from '@/shared/pg/types'
import type { Node } from '@db'

import { select } from '@/shared/pg'

export async function action(_: Node[], formData: FormData) {
  const value = formData.get('page_id')?.toString() ?? ''
  const where: Where<'node'>[] = [['page_id', '=', value]]
  const [, newNodes] = await select('node', '*', { where })
  return newNodes ?? []
}
