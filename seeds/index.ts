import { pool } from '@/shared/utilities/pg'
import { readdirSync } from 'node:fs'

type Caller = { order: number; seed: () => Promise<void> }

const files = readdirSync('seeds').filter((file) => !file.includes('index'))
const imports = files.map((file) => import(`./${file}`))
const callers: Caller[] = await Promise.all(imports)

for (const { seed } of callers.sort((a, b) => a.order - b.order)) await seed()

await pool.end()

console.log('Seeding ended')
