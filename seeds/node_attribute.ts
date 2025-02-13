import type { Node } from '@database'

import { database, insert } from '@/shared/pg'
import { createArray, lorem, randomInt } from '@/shared/utilities'

export const order = 4

export async function seed() {
  const [, nodes = []] = await database('node').select('id').query()
  const data = nodes.flatMap(genEntry)
  const [error] = await insert('node_attribute', data)
  const errorMessage = `Error in \`node_attribute\` table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `node_attribute` table'
  console.log(error ? errorMessage : successMessage)
}

function genEntry(node: Node) {
  const key = lorem().generateWords(2).replace(' ', '-')
  return createArray(randomInt(2, 5)).map(() => ({
    key: `data-${key}`,
    node_id: node.id,
    value: lorem().generateWords(5),
  }))
}
