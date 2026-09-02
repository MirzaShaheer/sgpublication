/**
 * Who is allowed to read the leads.
 *
 * One password and one signed cookie. No user table, no third party, no
 * dependency: the dashboard has exactly one reader and anything more than this
 * would be machinery guarding a single door.
 *
 * The single most important decision in this file is that it FAILS CLOSED.
 * Everywhere else in this project a missing environment variable degrades to
 * something that still works, because losing a lead is worse than a warning.
 * Here the opposite is true. With no ADMIN_PASSWORD set there is no way in at
 * all, rather than a way in for everybody, because the cost of getting that
 * backwards is every enquiry the site has ever taken being readable by anyone
 * who guesses the URL.
 *
 * Signed with Web Crypto rather than node:crypto so the identical code runs in
 * middleware, which is an Edge runtime with no node:crypto, and in the server
 * components that render the dashboard.
 */

export const ADMIN_COOKIE = 'sg_admin'

/** Seven days. Long enough not to be a nuisance, short enough to expire. */
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/**
 * True when both secrets are present and the dashboard can be opened at all.
 * The secret is required as well as the password: without it there is nothing
 * to sign the cookie with, and an unsigned session cookie is one a visitor can
 * simply type for themselves.
 */
export function adminConfigured(): boolean {
  return missingAdminConfig().length === 0
}

/**
 * Which of the two are missing, by name.
 *
 * Named in the 503 rather than left to be guessed. A dashboard that is shut
 * because a variable did not reach the running deployment is the single most
 * likely thing to go wrong here, and "set these two" sends you looking at both
 * when one of them is already right. It tells an attacker nothing the 503 did
 * not already tell them, which is that there is nothing here to get into.
 *
 * An empty string counts as missing. A blank ADMIN_PASSWORD would otherwise be
 * a password anyone could type.
 */
export function missingAdminConfig(): string[] {
  const missing: string[] = []
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD')
  if (!process.env.ADMIN_SESSION_SECRET) missing.push('ADMIN_SESSION_SECRET')
  return missing
}

/**
 * A comparison whose duration does not depend on where two strings differ.
 *
 * A plain `===` returns as soon as it finds a mismatched character, and the
 * time it took is a measurable hint about how much of a guess was correct. It
 * is a fussy detail for a one person dashboard and it costs one short function.
 */
function timingSafeEqual(a: string, b: string): boolean {
  // Comparing the encoded lengths first is unavoidable: the length is not a
  // secret, and a differing length cannot be compared byte for byte anyway.
  const left = new TextEncoder().encode(a)
  const right = new TextEncoder().encode(b)
  if (left.length !== right.length) return false

  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index]! ^ right[index]!
  }
  return difference === 0
}

async function hmac(value: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * The cookie value: an expiry, and a signature over that expiry.
 *
 * The expiry is inside the signed payload rather than left to the cookie's own
 * Max-Age, because a cookie's lifetime is a request for the browser's
 * cooperation and this is not. A copied cookie replayed after seven days does
 * not work, whatever the client claims about its age.
 */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = String(expiresAt)
  return `${payload}.${await hmac(payload)}`
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token || !adminConfigured()) return false

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return false

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  try {
    return timingSafeEqual(signature, await hmac(payload))
  } catch {
    return false
  }
}

/** Whether a submitted password is the configured one. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return timingSafeEqual(input, expected)
}
