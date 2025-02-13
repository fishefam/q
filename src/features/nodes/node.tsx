import type { Node as TNode } from '@database'
import type { JSX } from 'react'

import { useCMSContext } from '@/shared/components/contexts/cms'
import { memo, useEffect, useState } from 'react'

import { Nodes } from './nodes'

type NodeProperties = { node: TNode; nodeList: TNode[] }

export const Node = memo(InternalNode)

function InternalNode({ node, nodeList }: NodeProperties) {
  const { state } = useNode(node)

  const TagName = state.tag_name as keyof JSX.IntrinsicElements
  const { class_name } = state

  return (
    <TagName className={class_name ?? undefined}>
      <Nodes nodeList={nodeList} parent={state} />
    </TagName>
  )
}

function useNode(node: TNode) {
  const { nodes } = useCMSContext()
  const [state, setState] = useState(node)
  useEffect(() => void nodes.set(node.id, { setState, state }), [node.id, nodes, state])
  return { setState, state }
}
