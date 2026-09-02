import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_COOKIE,
  adminConfigured,
  missingAdminConfig,
  verifySessionToken,
} from '@/lib/admin-auth'

/**
 * The gate in front of the dashboard.
 *
 * It runs before any /admin page renders, which is the point: an unauthorised
 * visitor is redirected before a single lead is read out of the database,
 * rather than being shown a page that then decides to hide itself. The login
 * page and the route that receives the password are the two exceptions, or
 * there would be no way to get a cookie in the first place.
 *
 * Nothing else on the site passes through here. The matcher below is limited
 * to /admin on purpose, so the marketing pages stay as cheap to serve as they
 * were and a bug in this file cannot take down the home page.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Never cached and never indexed, whatever the answer turns out to be.
  const headers = { 'x-robots-tag': 'noindex, nofollow, noarchive' }

  const isLogin = pathname === '/admin/login'

  // No password configured means no dashboard, including no login page: there
  // is nothing a correct password could be checked against. Better a plain
  // 503 that says so than a login form that can never succeed.
  if (!adminConfigured()) {
    const missing = missingAdminConfig()
    return new NextResponse(
      `The dashboard is not configured. Not set in this deployment: ${missing.join(
        ' and ',
      )}. On Vercel, a variable added after a deployment was built does not reach it: set it for the right environment, then redeploy.`,
      { status: 503, headers: { ...headers, 'content-type': 'text/plain' } },
    )
  }

  const authenticated = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)

  if (isLogin) {
    // Already signed in and asking for the login page: go to the leads.
    if (authenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next({ headers })
  }

  if (!authenticated) {
    const login = new URL('/admin/login', request.url)
    // Where they were headed, so signing in lands there and not always on the
    // list. Only the path and query are carried, never an absolute URL from
    // the request, so this cannot be turned into an open redirect.
    if (pathname !== '/admin') login.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(login)
  }

  return NextResponse.next({ headers })
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
