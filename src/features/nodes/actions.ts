'use server'

import { database } from '@/shared/pg'

export async function getNodeList(pageId: string | undefined) {
  const [, nodeList] = await database('node')
    .select('*')
    .join('node_text.node_id', '=', 'node.id')
    .where('page_id', '=', pageId)
    .query()
  return nodeList
}
