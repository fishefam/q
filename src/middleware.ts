import { type NextRequest, NextResponse } from 'next/server'

import { getAuthMiddleware } from './shared/auth'

export const config = {
  matcher: [`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`],
}

export function middleware(request: NextRequest) {
  const withAuth = getAuthMiddleware()

  if (withAuth) return withAuth(request)

  return NextResponse.next()
}
