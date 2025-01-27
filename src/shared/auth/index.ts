import * as supabaseActions from './providers/supabase/actions'
import * as supabaseMiddleware from './providers/supabase/middleware'

const PROVIDERS = {
  supabase: {
    actions: supabaseActions,
    middleware: supabaseMiddleware.middleware,
  },
}

export function getAuthActions() {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER as
    | keyof typeof PROVIDERS
    | undefined
  if (provider) return PROVIDERS[provider].actions
}

export function getAuthMiddleware() {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER as
    | keyof typeof PROVIDERS
    | undefined
  if (provider) return PROVIDERS[provider]?.middleware
}
