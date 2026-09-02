'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signIn, type SignInState } from '@/app/admin/actions'

/**
 * The password field.
 *
 * A client component only because the error has to appear without losing the
 * page, and because the button has to be able to say it is working. The
 * password itself never touches client state: it goes straight from the input
 * into the FormData the action receives, so there is nothing here holding it
 * that a browser extension or a stray render could read.
 */

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full cursor-pointer rounded-md bg-bark px-4 py-2.5 text-small text-paper transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Checking' : 'Sign in'}
    </button>
  )
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<SignInState, FormData>(signIn, {})

  return (
    <form action={action} className="mt-7">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <label htmlFor="password" className="block text-fine text-ink-soft">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-describedby={state.error ? 'password-error' : undefined}
        aria-invalid={state.error ? true : undefined}
        className="mt-1.5 w-full rounded-md border border-paper-3 bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink-soft"
      />

      {state.error ? (
        <p id="password-error" role="alert" className="mt-2.5 text-fine text-gold-ink">
          {state.error}
        </p>
      ) : null}

      <Submit />
    </form>
  )
}
