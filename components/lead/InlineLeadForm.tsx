'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { Container } from '@/components/ui/Section'
import { Seal } from '@/components/brand/Seal'
import { Button } from '@/components/ui/Button'
import { trackLeadSubmit } from '@/lib/analytics'
import { PhoneField } from '@/components/lead/LeadFields'
import {
  countryLabel,
  formatPhone,
  stageChoices,
  DEFAULT_DIAL_COUNTRY,
  type AuthorStageValue,
  type LeadSourceValue,
} from '@/lib/lead-schema'

/**
 * The short form set into the home page itself, straight after the six stages,
 * where a visitor has read enough to have a question and not yet enough to
 * leave. It asks for a name, an email address and a number, which is what an
 * editor needs in order to answer at all, then which of the four stages they
 * are at and an open box for anything else. Everything past the three required
 * fields can be left alone: a longer form in the middle of a page is a page
 * people stop reading, and the full set of questions lives on /contact.
 *
 * The wrapper carries `data-lead-form`, which the overlay system watches: no
 * modal, bar or exit prompt opens while a form is on screen, so a visitor
 * already filling one in is never interrupted by another one.
 */

/* The shared control, defined once in globals.css: a ruled well that goes
   gold on focus. This file used to carry a near miss of it, which is what made
   the inline form read as a different set of controls from the popup. */
const inputClass = 'field'

/* Small caps display, the same voice the running heads and ledger headings
   use, so the form reads as part of the printed page rather than as a browser
   default dropped into it. */
const labelClass = 'marker block text-ink-soft'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const phonePattern = /^[0-9+()\s-]+$/

type Field = 'name' | 'email' | 'phone' | 'message'

const fieldOrder: Field[] = ['name', 'email', 'phone', 'message']

export function InlineLeadForm({ source }: { source: LeadSourceValue }) {
  const ids = useId()
  const id = (field: string) => `${ids}-${field}`

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState(DEFAULT_DIAL_COUNTRY)
  const [stage, setStage] = useState<AuthorStageValue | ''>('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot, see below
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const fieldRefs = useRef<
    Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>
  >({})
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

    if (!email.trim()) found.email = 'We need an email address to reply to.'
    else if (!emailPattern.test(email.trim()))
      found.email = 'That does not look like an email address.'

    if (!phone.trim())
      found.phone = 'Please give us a number we can reach you on.'
    else if (!phonePattern.test(phone.trim()))
      found.phone =
        'A phone number can use digits, spaces, brackets, a plus and a hyphen.'

    if (message.trim().length > 4000)
      found.message =
        'Please keep this under four thousand characters. The rest can wait for the call.'

    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormError(null)
      focusFirstInvalid(found)
      return
    }

    setSending(true)
    setFormError(null)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: formatPhone(country, phone),
          // The selector is there to qualify the dialling code rather than to
          // ask where someone lives, and a number is now always given, so the
          // country always travels with it.
          country: countryLabel(country),
          stage: stage || 'unknown',
          message,
          company,
          source,
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

      trackLeadSubmit(source, stage || 'unknown')
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

  return (
    <Container>
      <div
        data-lead-form
        className="grid gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-16"
      >
        <div>
          <Seal size={52} />
          <h2 className="mt-6 text-h2">Where is your book right now?</h2>
          <p className="measure mt-5 text-ink-soft">
            Tell us the stage you are at. An editor reads it, then writes back
            with the honest next step for a book like yours. No charge, and no
            sales call unless you ask for one.
          </p>
        </div>

        <div className="lg:pt-3">
          {done ? (
            <div className="measure-wide">
              <hr className="rule-gold" />
              <p
                ref={confirmationRef}
                tabIndex={-1}
                className="mt-6 font-display text-h3"
              >
                Thank you, that reached us.
              </p>
              <p className="mt-4 text-ink-soft">
                An editor will read it and email you back, usually the same
                working day and always within one. Nothing is charged and
                nothing is committed. If you would rather talk sooner, our
                number is at the foot of the page.
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="relative measure-wide"
            >
              {/*
                Honeypot. Hidden from people and from screen readers. A bot
                that fills it in gets a normal success response and nothing is
                written to the database. See lib/lead-schema.ts.
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

              <div className="grid gap-6 sm:grid-cols-2">
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
                    className={`${inputClass} mt-2`}
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
                    className={`${inputClass} mt-2`}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? id('email-error') : undefined
                    }
                  />
                  {errors.email ? (
                    <p
                      id={id('email-error')}
                      className="mt-2 text-small text-gold-ink"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Phone. Required, and asked for after the email because the
                  email is the thing most people expect to be asked for first.
                  The dialling code is a segment of the number rather than a
                  separate question: roughly a third of our authors are outside
                  the US, and a number stored without a country code is a
                  number nobody can ring. */}
              <PhoneField
                className="mt-6"
                idBase={id('lead')}
                country={country}
                onCountryChange={setCountry}
                phone={phone}
                onPhoneChange={setPhone}
                phoneRef={(node) => {
                  fieldRefs.current.phone = node
                }}
                error={errors.phone}
                hint="In case the email bounces, or you would rather we called."
              />

              <fieldset className="mt-8">
                <legend className="marker text-ink-soft">
                  Which one sounds like you
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

              {/* The one open question. Everything above it is a box to tick
                  or a line to fill; this is the only place a visitor can say
                  what is actually wrong in their own words, which is usually
                  the most useful thing in the whole submission. Optional, and
                  it says so, because plenty of people would rather say it on
                  the call. */}
              <div className="mt-8">
                <label className={labelClass} htmlFor={id('message')}>
                  What is giving you trouble? (optional)
                </label>
                <textarea
                  ref={(node) => {
                    fieldRefs.current.message = node
                  }}
                  id={id('message')}
                  name="message"
                  rows={5}
                  className={`${inputClass} mt-2 resize-y`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={
                    errors.message ? id('message-error') : id('message-hint')
                  }
                />
                {errors.message ? (
                  <p
                    id={id('message-error')}
                    className="mt-2 text-small text-gold-ink"
                  >
                    {errors.message}
                  </p>
                ) : (
                  <p id={id('message-hint')} className="mt-2 text-fine text-ink-soft">
                    What you are stuck on, what you have tried, what worries
                    you. A line or two is plenty, and leaving it empty is fine.
                  </p>
                )}
              </div>

              {formError ? (
                <p className="mt-6 text-small text-gold-ink">{formError}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button type="submit" size="lg" disabled={sending}>
                  {sending ? 'Sending' : 'Send this to us'}
                </Button>
                <p className="text-fine text-ink-soft">
                  We reply by email. We never sell your details.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Container>
  )
}
