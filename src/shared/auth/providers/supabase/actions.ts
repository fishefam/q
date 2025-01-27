'use server'

import has from 'lodash/has'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import isEmail from 'validator/es/lib/isEmail'
import isStrongPassword from 'validator/es/lib/isStrongPassword'

import { createClient } from './client'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const [, data] = getData(formData)

  if (data) {
    await supabase.auth.signInWithPassword(data)
    revalidatePath('/', 'layout')
    redirect('/')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/login', 'layout')
  redirect('/login')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const [, data] = getData(formData)

  if (data) {
    await supabase.auth.signUp(data)
    revalidatePath('/', 'layout')
    redirect('/')
  }
}

function getData(
  formData: FormData,
): [
  { email?: string; password?: string } | undefined,
  { email: string; password: string } | undefined,
] {
  const data = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }
  const error: { email?: string; password?: string } = {}
  if (!isEmail(data.email ?? '')) error.email = 'Invalid email'
  if (!isStrongPassword(data.password ?? '')) error.password = 'Weak password'
  if (has(error, 'email') || has(error, 'password')) return [error, undefined]
  return [undefined, data]
}
