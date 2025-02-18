import type { Node } from '@database'

import { useCMSContext } from '@/shared/components/contexts/cms'
import { useEffect, useState } from 'react'

import { getNodeList } from './actions'
import { Nodes } from './nodes'

export function NodeRender() {
  const { page } = useCMSContext()
  const [nodeList, setNodeList] = useState<Node[]>()

  useEffect(() => void (async () => setNodeList(await getNodeList(page?.id)))(), [page])

  console.log(nodeList)

  if (nodeList && nodeList.length > 0) return <Nodes nodeList={nodeList} />
}
