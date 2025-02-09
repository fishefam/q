import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '.env')
const variableMap = {
  'anon key': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'API URL': 'NEXT_PUBLIC_SUPABASE_URL',
  'DB URL': 'DATABASE_URL',
  'S3 Storage URL': 'BLOB_URL',
  'service_role key': 'BLOB_TOKEN',
}
const status = getSupabaseStatus()
const entries = status
  .split('\n')
  .map((v) => v.split(': ').map((v) => v.trim()))
  .map(([key, value]) => [
    variableMap[key],
    key.includes('service_role') ? `Bearer ${value}` : value,
  ])
  .filter(([key]) => key)
const finalEntries = [['AUTH_PROVIDER', 'supabase'], ...entries].sort()
const content = finalEntries
  .map(([key, value]) => `${key}="${value}"`)
  .join('\n')

if (!existsSync(envPath)) {
  writeFileSync(envPath, content)
  process.exit(0)
}

const existingEnv = readFileSync(envPath, 'utf8')
const newEntries = Object.values(variableMap)
  .filter((v) => !existingEnv.includes(`${v}=`))
  .map((v) => {
    const value = finalEntries.find(([key]) => key === v)
    if (value) return `${v}="${value[1]}"`
  })
  .filter((value) => value)

writeFileSync(envPath, `${existingEnv.trim()}\n${newEntries.join('\n')}`)

function getSupabaseStatus() {
  try {
    return execSync('npm run supabase status', { encoding: 'utf-8' })
  } catch {
    return ''
  }
}
