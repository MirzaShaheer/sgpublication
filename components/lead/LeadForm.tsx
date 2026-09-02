'use client'

import { useCallback, useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { trackLeadSubmit } from '@/lib/analytics'
import { stageOptions, type LeadSource, type LeadStage } from '@/lib/lead'
import { useLead } from '@/components/lead/LeadProvider'

/**
 * The form internals shared by all four capture points.
 *
 * Two shapes only. `TwoStepLeadForm` asks for the stage first and the details
 * second, because naming where you are is a question a visitor can answer
 * without commitment, and answering it is what earns the email. `EmailOnlyForm`
 * is the exit intent ask: one field, because a visitor already leaving will not
 * fill in three.
 *
 * The offer is a free roadmap and a free call, deliberately not a discount. A
 * discount popup signals desperation and puts SG in the same bucket as the low
 * trust competitors it is trying to be distinguishable from.
 */

export const leadOffer = {
  heading: 'Where is your book right now?',
  lede: 'Tell us the stage you are at and we will send the 20 page publishing roadmap for it, plus a free 30 minute call with an editor. No charge and no obligation.',
  detailsHeading: 'Where should we send it?',
  successHeading: 'On its way.',
  successBody:
    'The roadmap is in your inbox within a few minutes. An editor will email you personally about the call, usually the same working day.',
} as const

/* The shared control from globals.css. */
const inputClass = 'field'

const labelClass = 'marker block text-ink-soft'

type SubmitState = 'idle' | 'sending' | 'done' | 'error'

/**
 * One submit path for every form. A failed request is the only case the
 * visitor is told about, and the server is written so that almost nothing
 * reaches it: a lead that arrived is never reported as failed.
 */
function useLeadSubmit(source: LeadSource) {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const { markConverted } = useLead()

  const submit = useCallback(
    async (fields: Record<string, unknown>, stage?: LeadStage) => {
      setState('sending')
      setError(null)
      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...fields,
            source,
            path: window.location.pathname,
            referrer: document.referrer || undefined,
          }),
        })

        if (!response.ok) throw new Error(`Request failed: ${response.status}`)

        trackLeadSubmit(source, stage)
        markConverted()
        setState('done')
        return true
      } catch {
        setState('error')
        setError(
          'That did not go through. Try again, or email hello@sgpublication.com and we will pick it up from there.',
        )
        return false
      }
    },
    [source, markConverted],
  )

  return { submit, state, error }
}

function Success({ compact }: { compact?: boolean }) {
  return (
    <div>
      <hr className="rule-gold" />
      <p className={compact ? 'mt-5 font-display text-h4' : 'mt-6 font-display text-h3'}>
        {leadOffer.successHeading}
      </p>
      <p className="measure mt-3 text-small text-ink-soft">
        {leadOffer.successBody}
      </p>
    </div>
  )
}

/**
 * Stage, then details. The stage buttons are a radiogroup rather than a select,
 * because the four answers are the point of the question and hiding them behind
 * a dropdown loses the moment of recognition.
 */
export function TwoStepLeadForm({
  source,
  compact = false,
  autoFocus = false,
}: {
  source: LeadSource
  compact?: boolean
  autoFocus?: boolean
}) {
  const [stage, setStage] = useState<LeadStage | null>(null)
  const { submit, state, error } = useLeadSubmit(source)
  const ids = useId()

  if (state === 'done') return <Success compact={compact} />

  if (!stage) {
    return (
      <div>
        <ul role="list">
          {stageOptions.map((option) => (
            <li key={option.value}>
              <hr className="rule-quiet" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setStage(option.value)}
                className="group flex w-full items-baseline gap-4 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-5 shrink-0 bg-gold transition-[width] duration-200 ease-page group-hover:w-8"
                />
                <span className="block">
                  <span className="block font-display text-h4 underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page group-hover:decoration-gold group-focus-visible:decoration-gold">
                    {option.label}
                  </span>
                  {compact ? null : (
                    <span className="measure mt-1.5 block text-small text-ink-soft">
                      {option.hint}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <hr className="rule-quiet" aria-hidden="true" />
      </div>
    )
  }

  const chosen = stageOptions.find((option) => option.value === stage)

  return (
    <form
      noValidate
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        await submit(
          {
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            company: data.get('company'),
            stage,
          },
          stage,
        )
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-small text-ink-soft">
          <span className="text-ink">{chosen?.label}</span>
        </p>
        <button
          type="button"
          onClick={() => setStage(null)}
          className="btn btn-quiet text-small"
        >
          Change
        </button>
      </div>

      <hr className="rule-gold mt-3" />

      {/* The reply. Set in the display serif rather than in the body sans, so
          it reads as an answer to what they just told us and not as another
          line of form instruction. It is announced politely: the fields are
          already rendered by the time it appears, so a live region would
          interrupt rather than inform. */}
      {chosen ? (
        <p
          className={[
            'measure font-display text-h4',
            compact ? 'mt-5' : 'mt-6',
          ].join(' ')}
        >
          {chosen.response}
        </p>
      ) : null}

      <div className={compact ? 'mt-6 grid gap-4' : 'mt-8 grid gap-5 sm:grid-cols-2'}>
        <div>
          <label className={labelClass} htmlFor={`${ids}-name`}>
            Your name
          </label>
          <input
            id={`${ids}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            /* eslint-disable-next-line jsx-a11y/no-autofocus */
            autoFocus={autoFocus}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${ids}-email`}>
            Email
          </label>
          <input
            id={`${ids}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>
        {compact ? null : (
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor={`${ids}-phone`}>
              Phone, if you would rather we called
            </label>
            <input
              id={`${ids}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        )}
      </div>

      <Honeypot ids={ids} />

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" size={compact ? 'md' : 'lg'} disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Send me the roadmap'}
        </Button>
        <p className="text-fine text-ink-soft">
          No newsletter. We use it for your roadmap and the call, nothing else.
        </p>
      </div>

      <FormError error={error} />
    </form>
  )
}

/** The exit intent ask. One field, because a visitor on their way out is not
    going to fill in three. */
export function EmailOnlyForm({ source }: { source: LeadSource }) {
  const { submit, state, error } = useLeadSubmit(source)
  const ids = useId()

  if (state === 'done') return <Success compact />

  return (
    <form
      noValidate
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        await submit({
          email: data.get('email'),
          company: data.get('company'),
          stage: 'unknown',
        })
      }}
    >
      <label className={labelClass} htmlFor={`${ids}-email`}>
        Email
      </label>
      <div className="flex items-end gap-4">
        <input
          id={`${ids}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
        <Button type="submit" disabled={state === 'sending'} className="shrink-0">
          {state === 'sending' ? 'Sending' : 'Send it'}
        </Button>
      </div>

      <Honeypot ids={ids} />
      <FormError error={error} />
    </form>
  )
}

/**
 * The honeypot. Hidden from sight and from assistive technology, never
 * autofilled, and never submitted by a person. A filled one is answered with
 * success by the API and written nowhere.
 */
function Honeypot({ ids }: { ids: string }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor={`${ids}-company`}>Company</label>
      <input
        id={`${ids}-company`}
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}

function FormError({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <p role="alert" className="measure mt-4 text-small text-gold-ink">
      {error}
    </p>
  )
}
