import type { Node } from '@database'

import { insert, table } from '@/shared/pg'
import { createArray, lorem, randomInt } from '@/shared/utilities'

export const order = 4

export async function seed() {
  const [, nodes = []] = await table('node').select('id').execute()
  const data = nodes.flatMap(genEntry)
  const [error] = await insert('node_attribute', data)
  const errorMessage = `Error in \`node_attribute\` table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node_attribute` table'
  console.log(error ? errorMessage : successMessage)
}

function genEntry(node: Node) {
  return createArray(randomInt(2, 5)).map(() => ({
    key: `data-${lorem().generateWords(2).replace(' ', '-')}`,
    node_id: node.id,
    value: lorem().generateWords(5),
  }))
}
