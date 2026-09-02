import type { LeadRecord } from '@/lib/lead-schema'

/**
 * The database handle, or null.
 *
 * The site is required to run with no DATABASE_URL and no generated Prisma
 * client at all, so that `npm run dev` works on a fresh checkout and every
 * page still serves. Nothing in this module throws: a database problem
 * degrades to a logged warning, never to a 500 that loses a lead.
 *
 * The client is imported lazily inside the function on purpose. A static
 * import would pull the generated client into the module graph at build time,
 * which is exactly what fails when `prisma generate` has not been run.
 */

/**
 * The one query the site makes, typed structurally rather than from the
 * generated client, so this file compiles whether or not that client exists.
 * The real PrismaClient satisfies this shape.
 */
export type Db = {
  lead: {
    create(args: { data: LeadRecord }): Promise<{ id: string }>
  }
}

type GlobalWithDb = typeof globalThis & {
  __sgDb?: Db
  __sgDbWarned?: boolean
}

const globalForDb = globalThis as GlobalWithDb

/** Warned once per process, not once per request. */
function warnOnce(message: string, error?: unknown) {
  if (globalForDb.__sgDbWarned) return
  globalForDb.__sgDbWarned = true
  if (error) console.warn(message, error)
  else console.warn(message)
}

export async function getDb(): Promise<Db | null> {
  // No connection string means no database, and no attempt to load a client.
  if (!process.env.DATABASE_URL) return null

  // Cached on globalThis so a hot reload in development does not open a new
  // pool on every edit. A serverless instance in production wants the same
  // cache for the same reason.
  if (globalForDb.__sgDb) return globalForDb.__sgDb

  try {
    const prisma = await import('@prisma/client')
    const client = new prisma.PrismaClient({
      log: ['error'],
    }) as unknown as Db
    globalForDb.__sgDb = client
    return client
  } catch (error) {
    warnOnce(
      '[lead] Prisma client could not be loaded, so leads will be logged instead of stored. Run `npx prisma generate` to enable the database.',
      error,
    )
    return null
  }
}
