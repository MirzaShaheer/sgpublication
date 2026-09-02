'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * The marketing chrome, on the marketing site only.
 *
 * The dashboard lives under the same root layout as every public page, because
 * a route group with a second root layout would mean moving every page in the
 * site into a group to gain one private one. So the chrome opts out instead:
 * the masthead, the footer, the shelf curtain and the lead overlays have no
 * business around a table of leads, and the exit intent popup firing while you
 * read an enquiry would be a small absurdity.
 *
 * usePathname resolves during server rendering as well as on the client, so on
 * /admin none of this is in the server HTML either. Nothing appears and then
 * vanishes.
 */
export function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
