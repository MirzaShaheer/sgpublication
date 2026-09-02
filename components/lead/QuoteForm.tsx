'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { PhoneField } from '@/components/lead/LeadFields'
import { Button } from '@/components/ui/Button'
import { useLead } from '@/components/lead/LeadProvider'
import { trackLeadSubmit } from '@/lib/analytics'
import {
  DEFAULT_DIAL_COUNTRY,
  budgetOptions,
  countryLabel,
  dialCodes,
  formatPhone,
  stageChoices,
  type AuthorStageValue,
} from '@/lib/lead-schema'
import { services } from '@/content/services'
import { site } from '@/lib/site'

/**
 * Request a quote.
 *
 * The quote ask lives on the page rather than behind a button that goes
 * somewhere else. A visitor who has just read what a service includes is at
 * the exact point of highest intent, and sending them to a different page to
 * start again loses a share of them for no gain.
 *
 * It asks one question the other forms do not: which service. On a service
 * page that answer arrives already filled in, so the visitor confirms rather
 * than chooses.
 *
 * The wrapper carries `data-lead-form`, which the overlay system watches, so
 * no modal, bar or exit prompt opens on top of somebody already filling this
 * in. See components/lead/LeadProvider.tsx.
 *
 * WIRE NOTE. The service is sent inside `message`, not as its own column, and
 * `source` stays 'inline'. Adding a `quote` member to the LeadSource enum
 * would need a Prisma migration against a live table for no real gain: the
 * `path` column already records which service page the quote came from, so the
 * two are separable in reporting without touching the schema.
 */

/* The shared control from globals.css, and the same small caps label voice
   the rest of the site's forms use. */
const fieldClass = 'field'

const labelClass = 'marker block text-ink-soft'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^[0-9+()\s-]+$/

/** The answer for somebody who wants the whole book rather than one piece. */
const NOT_SURE = 'More than one, or I am not sure yet'

type Field = 'name' | 'email' | 'phone' | 'message'

const fieldOrder: Field[] = ['name', 'email', 'phone', 'message']

type Focusable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function QuoteForm({
  /** Preselects the service dropdown. Omit on the index, where nothing is chosen yet. */
  serviceSlug,
  heading = 'Request a quote',
  lede = 'Tell us what you need and where the book is. An editor replies with a real price and a real timeframe. No charge, and no call unless you want one.',
}: {
  serviceSlug?: string
  heading?: string
  lede?: string
}) {
  const ids = useId()
  const id = (field: string) => `${ids}-${field}`
  const { markConverted } = useLead()

  const preselected = services.find((service) => service.slug === serviceSlug)

  const [service, setService] = useState(preselected?.name ?? '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState(DEFAULT_DIAL_COUNTRY)
  const [phone, setPhone] = useState('')
  const [stage, setStage] = useState<AuthorStageValue | ''>('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot, see the note below
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const fieldRefs = useRef<Partial<Record<Field, Focusable | null>>>({})
  const confirmationRef = useRef<HTMLParagraphElement>(null)

  function focusFirstInvalid(found: Partial<Record<Field, string>>) {
    for (const field of fieldOrder) {
      if (found[field]) {
        fieldRefs.current[field]?.focus()
        return
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return // no double submission

    // Validation runs on submit, never on every keystroke.
    const found: Partial<Record<Field, string>> = {}
    if (!name.trim()) found.name = 'Please tell us your name.'
    else if (name.trim().length > 120)
      found.name = 'That name is too long to store.'
    if (!email.trim()) found.email = 'We need an email address to send the quote to.'
    else if (!emailPattern.test(email.trim()))
      found.email = 'That does not look like an email address.'
    if (!phone.trim())
      found.phone = 'Please give us a number we can reach you on.'
    else if (!phonePattern.test(phone.trim()))
      found.phone =
        'A phone number can use digits, spaces, brackets, a plus and a hyphen.'
    if (message.trim().length > 4000)
      found.message = 'Please keep this under four thousand characters. The rest can wait for the call.'

    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormError(null)
      focusFirstInvalid(found)
      return
    }

    setSending(true)
    setFormError(null)

    // The chosen service leads the message, so whoever reads the lead knows
    // what is being asked for before reading a word of the rest.
    const wanted = service || NOT_SURE
    const body = message.trim()
    const composed = body
      ? `Quote requested for: ${wanted}\n\n${body}`
      : `Quote requested for: ${wanted}`

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          // The dialling code is stored with the number, and the country name
          // always travels with it, so a number is never left unringable.
          phone: formatPhone(country, phone),
          country: countryLabel(country),
          stage: stage || 'unknown',
          budget,
          message: composed,
          company,
          source: 'inline',
          path: window.location.pathname,
          referrer: document.referrer || undefined,
        }),
      })

      if (!response.ok) {
        setSending(false)
        setFormError(
          'That did not send. Please try again, or email us and we will pick it up from there.',
        )
        return
      }

      trackLeadSubmit('inline', stage || 'unknown')
      markConverted()
      setDone(true)
      // Focus moves to the confirmation so a screen reader hears it. The whole
      // form is swapped out, which is why this is focus management rather than
      // an aria-live region.
      window.requestAnimationFrame(() => confirmationRef.current?.focus())
    } catch {
      setSending(false)
      setFormError(
        'That did not send. Please check your connection and try again.',
      )
    }
  }

  if (done) {
    return (
      <div data-lead-form className="measure-wide">
        <hr className="rule-gold" />
        <p
          ref={confirmationRef}
          tabIndex={-1}
          className="mt-6 font-display text-h3"
        >
          Thank you, that reached us.
        </p>
        <p className="mt-4 text-ink-soft">
          An editor will read it and email you a written quote, usually the same
          working day and always within one. It will name a number, a timeframe
          and what is not included. Nothing is charged and nothing is committed.
        </p>
        <p className="mt-4 text-small text-ink-soft">
          If you would rather talk sooner, call{' '}
          <a className="link" href={`tel:${site.phoneHref}`}>
            {site.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div data-lead-form>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="quote-title" className="text-h2">
            {heading}
          </h2>
          <p className="measure mt-5 text-ink-soft">{lede}</p>
          <hr className="rule-quiet mt-8" aria-hidden="true" />
          <p className="mt-6 text-small text-ink-soft">
            Prefer to write to a person?{' '}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>

        <div className="lg:pt-2">
          <form noValidate onSubmit={handleSubmit} className="relative measure-wide">
            {/*
              Honeypot. Hidden from people and from screen readers. A bot that
              fills it in gets a normal success response and nothing is written
              to the database. See lib/lead-schema.ts.
            */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor={id('company')}>Company</label>
              <input
                id={id('company')}
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={id('service')}>
                What do you need a quote for?
              </label>
              <div className="relative mt-2">
                <select
                  id={id('service')}
                  name="service"
                  className={`${fieldClass} appearance-none pr-9`}
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                >
                  <option value="">{NOT_SURE}</option>
                  {services.map((entry) => (
                    <option key={entry.slug} value={entry.name}>
                      {entry.name}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={id('name')}>
                  Your name (required)
                </label>
                <input
                  ref={(node) => {
                    fieldRefs.current.name = node
                  }}
                  id={id('name')}
                  name="name"
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="name"
                  className={`${fieldClass} mt-2`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? id('name-error') : undefined}
                />
                {errors.name ? (
                  <p id={id('name-error')} className="mt-2 text-small text-gold-ink">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={labelClass} htmlFor={id('email')}>
                  Email address (required)
                </label>
                <input
                  ref={(node) => {
                    fieldRefs.current.email = node
                  }}
                  id={id('email')}
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  className={`${fieldClass} mt-2`}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? id('email-error') : undefined}
                />
                {errors.email ? (
                  <p id={id('email-error')} className="mt-2 text-small text-gold-ink">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              {/* The dialling code is a segment of the number rather than a
                  separate question, matching every other form: roughly a third
                  of our authors are outside the US, and a number stored without
                  a country code is a number nobody can ring. */}
              <PhoneField
                idBase={id('quote')}
                country={country}
                onCountryChange={setCountry}
                phone={phone}
                onPhoneChange={setPhone}
                phoneRef={(node) => {
                  fieldRefs.current.phone = node
                }}
                error={errors.phone}
                hint="So we can reach you if the email bounces. We do not cold call."
              />

              <div>
                <label className={labelClass} htmlFor={id('budget')}>
                  Budget in mind (optional)
                </label>
                <div className="relative mt-2">
                  <select
                    id={id('budget')}
                    name="budget"
                    className={`${fieldClass} appearance-none pr-9`}
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  >
                    <option value="">Rather not say</option>
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </div>
            </div>

            <fieldset className="mt-8">
              <legend className="marker text-ink-soft">
                Where the book is today
              </legend>
              <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {stageChoices.map((choice) => (
                  <label
                    key={choice.value}
                    className="flex cursor-pointer items-baseline gap-3 border-b border-paper-3 py-3 text-body"
                  >
                    <input
                      type="radio"
                      name={id('stage')}
                      value={choice.value}
                      checked={stage === choice.value}
                      onChange={() => setStage(choice.value)}
                      className="accent-gold-ink"
                    />
                    <span>{choice.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8">
              <label className={labelClass} htmlFor={id('message')}>
                Anything that would help us quote it properly (optional)
              </label>
              <textarea
                ref={(node) => {
                  fieldRefs.current.message = node
                }}
                id={id('message')}
                name="message"
                rows={4}
                className={`${fieldClass} mt-2 resize-y`}
                placeholder="Word count, subject, deadline, or what you have already been quoted elsewhere."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? id('message-error') : undefined}
              />
              {errors.message ? (
                <p id={id('message-error')} className="mt-2 text-small text-gold-ink">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {formError ? (
              <p className="mt-6 text-small text-gold-ink">{formError}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? 'Sending' : 'Request a quote'}
              </Button>
              <p className="text-fine text-ink-soft">
                We reply by email. We never sell your details.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/** The select indicator. Decorative: every select works without it. */
function Chevron() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="11"
      height="7"
      viewBox="0 0 11 7"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold"
    >
      <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  )
}
