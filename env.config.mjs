import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '.env')
const variables = ['AUTH_PROVIDER', 'BLOB_TOKEN', 'BLOB_URL', 'DATABASE_URL']
const status = getSupabaseStatus()
const entries = status
  .split('\n')
  .map((v) => v.split(': ').map((v) => v.trim()))
  .map(([key, value]) => [
    key === 'DB URL'
      ? 'DATABASE_URL'
      : key === 'S3 Storage URL'
        ? 'BLOB_URL'
        : key === 'service_role key'
          ? 'BLOB_TOKEN'
          : key,
    key === 'service_role key' ? `Bearer ${value}` : value,
  ])
  .filter(([key]) => variables.includes(key))
const finalEntries = [['AUTH_PROVIDER', 'supabase'], ...entries]
const content =
  finalEntries.map(([key, value]) => `${key}="${value}"`).join('\n') + '\n'

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, content)
  process.exit(0)
}

const existingEnv = fs.readFileSync(envPath, 'utf8')
const newEntries = variables
  .filter((v) => !existingEnv.includes(`${v}=`))
  .map((v) => `${v}="${finalEntries.find(([key]) => key === v)[1]}"`)
fs.writeFileSync(envPath, `${existingEnv.trim()}\n${newEntries.join('\n')}`)

function getSupabaseStatus() {
  try {
    return execSync('npm run supabase status', { encoding: 'utf-8' })
  } catch {
    return ''
  }
}
