import type { Node as TNode } from '@database'

import { Node } from './node'

type NodesProperties = { nodeList: TNode[]; parent?: TNode }

export function Nodes({ nodeList, parent }: NodesProperties) {
  // eslint-disable-next-line unicorn/no-null
  const nodes = nodeList.filter((node) => node.mount_id === (parent?.id ?? null))

  return nodes.map((node) => <Node key={node.id} node={node} nodeList={nodeList} />)
}
