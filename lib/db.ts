import type {
  AuthorStageValue,
  LeadRecord,
  LeadSourceValue,
  LeadStatusValue,
} from '@/lib/lead-schema'

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

/** A `Lead` row as Postgres returns it: absent values are null, not undefined. */
export type LeadRow = {
  id: string
  createdAt: Date
  name: string | null
  email: string
  phone: string | null
  country: string | null
  stage: AuthorStageValue
  genre: string | null
  wordCount: number | null
  budget: string | null
  message: string | null
  source: LeadSourceValue
  path: string | null
  referrer: string | null
  userAgent: string | null
  status: LeadStatusValue
  notes: string | null
  notifiedAt: Date | null
}

/**
 * Only the queries the site actually makes, typed structurally rather than
 * from the generated client, so this file compiles whether or not that client
 * exists. The real PrismaClient satisfies this shape.
 *
 * `where` and `orderBy` are deliberately loose. Narrowing them properly would
 * mean restating a slice of Prisma's generated types by hand, which is a lot
 * of surface to keep in step with the schema for no safety we do not already
 * get from the row type and from every caller living in this repository.
 */
export type LeadWhere = Record<string, unknown>

export type Db = {
  lead: {
    create(args: { data: LeadRecord }): Promise<{ id: string }>
    update(args: {
      where: { id: string }
      data: Partial<Pick<LeadRow, 'status' | 'notes' | 'notifiedAt'>>
    }): Promise<{ id: string }>
    findUnique(args: { where: { id: string } }): Promise<LeadRow | null>
    findMany(args: {
      where?: LeadWhere
      orderBy?: Record<string, 'asc' | 'desc'>
      take?: number
      skip?: number
    }): Promise<LeadRow[]>
    count(args?: { where?: LeadWhere }): Promise<number>
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
