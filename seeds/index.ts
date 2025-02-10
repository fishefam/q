import { readdirSync } from 'fs'

async function main() {
  const files = readdirSync('seeds').filter((file) => !file.includes('index'))
  const callers: { order: number; seed: () => void }[] = await Promise.all(
    files.map((file) => import('./' + file)),
  )
  for (const { seed } of callers.sort((a, b) => a.order - b.order)) seed()
}

main()
