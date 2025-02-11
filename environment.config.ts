#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const environmentPath = path.join(__dirname, '.env')
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
  .map(([key, value]) => [variableMap[key as never], key.includes('service_role') ? `Bearer ${value}` : value])
  .filter(([key]) => key)
const finalEntries = [['AUTH_PROVIDER', 'supabase'], ...entries].sort()
const content = finalEntries.map(([key, value]) => `${key}="${value}"`).join('\n')

if (!existsSync(environmentPath)) {
  writeFileSync(environmentPath, content)
  process.exit(0)
}

const existingEnvironment = readFileSync(environmentPath, 'utf8')
const newEntries = Object.values(variableMap)
  .filter((v) => !existingEnvironment.includes(`${v}=`))
  .map((v) => {
    const value = finalEntries.find(([key]) => key === v)
    if (value) return `${v}="${value[1]}"`
  })
  .filter(Boolean)

writeFileSync(environmentPath, `${existingEnvironment.trim()}\n${newEntries.join('\n')}`)

function getSupabaseStatus() {
  try {
    return execSync('npm run supabase status', { encoding: 'utf8' })
  } catch {
    return ''
  }
}
