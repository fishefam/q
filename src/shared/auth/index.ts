import { NextResponse } from 'next/server'

import * as supabase from './providers/supabase'

type Auth = Record<AuthProvider, typeof supabase>

const actionPlaceholder = () => Promise.resolve({})
const placeholder: Auth['supabase'] = {
  actions: {
    login: actionPlaceholder,
    logout: actionPlaceholder,
    signup: actionPlaceholder,
  },
  middleware: () => Promise.resolve(NextResponse.json({})),
}

const AUTH: Auth = {
  auth0: placeholder,
  firebase: placeholder,
  supabase,
}

const provider = process.env.AUTH_PROVIDER

export function getAuthActions() {
  if (provider) return AUTH[provider].actions
}

export function getAuthMiddleware() {
  if (provider) return AUTH[provider].middleware
}
