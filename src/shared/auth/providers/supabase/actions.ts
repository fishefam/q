'use server'

import has from 'lodash/has'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import isEmail from 'validator/es/lib/isEmail'
import isStrongPassword from 'validator/es/lib/isStrongPassword'

import { AuthError } from '../..'
import { createClient } from './client'

type Data = Record<'email' | 'password', string>
type Error_ = { login?: string } & Partial<Data>

export async function login(_: Error_ | undefined, formData: FormData) {
  const supabase = await createClient()
  const [error, data] = getData(formData)

  if (data) {
    const result = await supabase.auth.signInWithPassword(data)

    if (result.error)
      return { login: AuthError.InvalidCredentials } satisfies Error_

    revalidatePath('/', 'layout')
    redirect('/')
  }

  return error
}

export async function logout(redirectTo?: Path) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath(redirectTo ?? '/cms/login', 'layout')
  redirect(redirectTo ?? '/cms/login')
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
  checkStrongPassword = false,
): [Error_ | undefined, Data | undefined] {
  const data = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }
  const error: { email?: string; password?: string } = {}
  if (!isEmail(data.email ?? '')) error.email = 'Invalid email'
  if (checkStrongPassword && !isStrongPassword(data.password ?? ''))
    error.password = 'Weak password'
  if (has(error, 'email') || has(error, 'password')) return [error, undefined]
  return [undefined, data]
}
