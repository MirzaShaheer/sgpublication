import type { LeadWhere } from '@/lib/db'
import { leadSources, leadStatuses } from '@/lib/lead-schema'

/**
 * How a query string becomes a database filter.
 *
 * Its own module because the table and the CSV export both need it and must
 * agree: an export that quietly ignored the filters you were looking at would
 * be worse than one that offered none.
 *
 * Nothing here trusts what arrives. A status or source is only used when it is
 * a member of the enum, so a hand edited URL can never reach Prisma with a
 * value the column does not have.
 */
export type Filters = {
  status?: string
  source?: string
  q?: string
  page?: string
}

function asMember<T extends string>(list: readonly T[], value?: string): T | null {
  return value && list.includes(value as T) ? (value as T) : null
}

export const activeStatus = (filters: Filters) => asMember(leadStatuses, filters.status)
export const activeSource = (filters: Filters) => asMember(leadSources, filters.source)

export function buildWhere(filters: Filters): LeadWhere {
  const where: LeadWhere = {}

  const status = activeStatus(filters)
  if (status) where.status = status

  const source = activeSource(filters)
  if (source) where.source = source

  const q = filters.q?.trim()
  if (q) {
    // Name, email and phone, because those are the three things you have when
    // somebody rings back and you need to work out who they are.
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
    ]
  }

  return where
}

/** The current query string with parameters changed, and page 1 restored. */
export function queryWith(filters: Filters, change: Partial<Filters>): string {
  const params = new URLSearchParams()
  const merged = { ...filters, page: undefined, ...change }
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, String(value))
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}
