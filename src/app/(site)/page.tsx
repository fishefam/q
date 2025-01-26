import { Client } from 'pg'

export default async function Page() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log(client)
  return <>Hello</>
}
