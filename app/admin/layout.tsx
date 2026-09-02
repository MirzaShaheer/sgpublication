import type { Metadata } from 'next'
import Link from 'next/link'
import { signOut } from '@/app/admin/actions'
import { isSignedIn } from '@/lib/admin-session'

/**
 * The dashboard's own chrome, since the marketing masthead and footer opt out
 * of /admin in components/site/SiteOnly.tsx.
 *
 * The metadata here is the belt to middleware's braces: middleware sets an
 * x-robots-tag header on every /admin response, and this puts the same
 * instruction in the markup. Neither is a security measure, both are cheap,
 * and a dashboard full of real people's contact details appearing in a search
 * result is not a mistake worth risking twice.
 */
export const metadata: Metadata = {
  title: 'Leads',
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The login page renders inside this layout too, and it must not offer a
  // sign out control to somebody who is not signed in.
  const signedIn = await isSignedIn()

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-paper-3 bg-paper-2">
        <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/admin"
            className="font-display text-h4 tracking-tight text-ink no-underline"
          >
            SG Publication
            <span className="ml-2 font-sans text-fine uppercase tracking-[0.14em] text-ink-soft">
              Leads
            </span>
          </Link>

          {signedIn ? (
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer rounded-md border border-paper-3 bg-paper px-3 py-1.5 text-fine text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </header>

      {/* A div and not a main: the root layout already put this inside one. */}
      <div className="mx-auto max-w-page px-5 py-8">{children}</div>
    </div>
  )
}
