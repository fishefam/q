import { Client } from 'pg'

export default async function SignIn() {
  const postgres = new Client({ connectionString: process.env.DATABASE_URL })
  await postgres.connect()
  console.log(postgres)
  return <>Hello</>
}
