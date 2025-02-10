import { pool } from '@/shared/pg'
import { readdirSync } from 'node:fs'

type Seed = { order: number; seed: () => Promise<void> }

const files = readdirSync('seeds').filter((file) => !file.includes('index'))
const imports = files.map((file) => import(`./${file}`))
const seeds: Seed[] = await Promise.all(imports)

for (const { seed } of seeds.sort((a, b) => a.order - b.order)) await seed()

await pool.end()

console.log('Seeding ended')
