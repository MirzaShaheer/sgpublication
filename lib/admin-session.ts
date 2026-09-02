import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth'

/**
 * Reading the session from a server component or a server action.
 *
 * Separate from lib/admin-auth.ts because that module is imported by
 * middleware, which runs in an Edge runtime where next/headers does not exist.
 * Keeping the cookie jar out of there is what lets one signing implementation
 * serve both places.
 */
export async function isSignedIn(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  return verifySessionToken(token)
}

/**
 * Throws unless the caller is signed in.
 *
 * Middleware already turns an unauthenticated visitor away before any /admin
 * page renders, so in normal use this never fires. It is here because a server
 * action is a POST endpoint like any other, and an endpoint that changes a
 * lead should check for itself rather than trust that something upstream did.
 * One misconfigured matcher should not be the only thing standing in the way.
 */
export async function requireSession(): Promise<void> {
  if (!(await isSignedIn())) throw new Error('Not signed in.')
}
