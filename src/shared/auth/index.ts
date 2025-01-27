import * as supabaseActions from './providers/supabase/actions'
import * as supabaseMiddleware from './providers/supabase/middleware'

const PROVIDERS = {
  supabase: {
    actions: supabaseActions,
    middleware: supabaseMiddleware.middleware,
  },
}

const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER as
  | keyof typeof PROVIDERS
  | undefined

export function getAuthActions() {
  if (provider) return PROVIDERS[provider].actions
}

export function getAuthMiddleware() {
  if (provider) return PROVIDERS[provider]?.middleware
}
