'use server'

import type { AuthError } from '../../utilities'

import { getAuthFormData, redirect } from '../../utilities'
import { createClient } from './client'

export async function login(_: AuthError | undefined, formData: FormData) {
  return sharedAction(formData, 'signInWithPassword')
}

export async function logout(_: AuthError | undefined, formData: FormData) {
  const [, data] = getAuthFormData(formData)
  const supabase = await createClient()
  const result = await supabase.auth.signOut()
  if (result.error) return { action: result.error } as AuthError
  redirect(data?.redirectTo)
}

export async function signup(_: AuthError | undefined, formData: FormData) {
  return sharedAction(formData, 'signUp')
}

async function sharedAction(
  formData: FormData,
  action: 'signInWithPassword' | 'signUp',
) {
  const [error, data] = getAuthFormData(formData)
  const supabase = await createClient()

  if (data && data.email && data.password) {
    const result = await supabase.auth[action]({
      email: data.email,
      password: data.password,
    })
    if (result.error) return { action: result.error } as AuthError
    redirect(data.redirectTo)
  }

  return error
}
