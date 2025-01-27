import { type NextRequest, NextResponse } from 'next/server'

import { updateSession } from './shared/auth/providers/supabase/middleware'

export const config = {
  matcher: [
    `/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
}

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER) return updateSession(request)
  return NextResponse.next()
}
