import * as supabase from './providers/supabase/actions'

export enum AuthError {
  InvalidCredentials = 'Wrong email or password',
}

export function getActions() {
  const providers = {
    supabase,
  }
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER as
    | keyof typeof providers
    | undefined
  if (provider) return providers[provider]
}
