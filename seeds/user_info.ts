import type { UserInfoInput } from '@db'

import { insert } from '@/shared/pg'
import { nanoid } from 'nanoid'

export const order = 0

export async function seed() {
  const data: UserInfoInput[] = [{ alias: 'Trg', id: nanoid(), role: 'root' }]
  const [error] = await insert('user_info', data)
  const errorMessage = `Error in page table: ${error?.message}`
  const successMessage = 'Succesfully seeded into `user_info` table'
  console.log(error ? errorMessage : successMessage)
  return
}
