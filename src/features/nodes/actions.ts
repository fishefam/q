'use server'

import { select } from '@/shared/pg'

export async function getNodeList(pageId: string | undefined) {
  const [, nodeList] = await select('node', '*', { where: [['page_id', '=', pageId]] })
  return nodeList
}
