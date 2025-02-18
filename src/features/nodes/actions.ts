'use server'

import { table } from '@/shared/pg'

export async function getNodeList(pageId: string | undefined) {
  // const { jsonbObjectAgg } = getAggregates('node_attribute')
  const query = table('node', { distinct: true })
    .select('"node".*')
    .join(['node_text.text', 'nt'], '=', 'node.id', 'left')
    .where('node.page_id', '=', pageId)
    .groupBy('"node"."tags"')
  const [, nodeList] = await query.execute()
  console.log(query.toString())
  return nodeList
}

await getNodeList('')
