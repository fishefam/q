'use server'

import { AuthErrorMessage, getAuthFormData, redirect } from '../../utilities'
import { createClient } from './client'

export async function login(_: AuthError | undefined, formData: FormData) {
  return sharedAction(formData, 'signInWithPassword')
}

export async function logout(_: AuthError | undefined, formData: FormData) {
  const [, data] = getAuthFormData(formData)
  const supabase = await createClient()
  await supabase.auth.signOut()
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

  if (data) {
    const result = await supabase.auth[action](data)
    if (result.error) return { action: AuthErrorMessage.InvalidCredentials }
    redirect(data.redirectTo)
  }

  return error
}
