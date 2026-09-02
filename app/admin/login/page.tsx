import { LoginForm } from '@/app/admin/login/LoginForm'

/**
 * The one door.
 *
 * Middleware lets this page through unauthenticated and redirects away from it
 * once a session exists, so it is never reachable in a state where it makes no
 * sense. It also refuses to serve at all when no ADMIN_PASSWORD is set, which
 * is why this page can assume there is a password to check against.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="font-display text-h3 tracking-tight">Sign in</h1>
      <p className="mt-2 text-small text-ink-soft">
        The enquiries this site has taken, and nothing else.
      </p>
      <LoginForm next={next} />
    </div>
  )
}
