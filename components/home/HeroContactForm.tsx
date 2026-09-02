'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import {
  PhoneField,
  TextField,
  TextareaField,
  isEmailish,
  submissionContext,
  submitLead,
} from '@/components/lead/LeadFields'
import { Button } from '@/components/ui/Button'
import { trackLeadSubmit } from '@/lib/analytics'
import {
  DEFAULT_DIAL_COUNTRY,
  countryLabel,
  formatPhone,
} from '@/lib/lead-schema'

/**
 * The short form in the hero, where the book used to stand.
 *
 * Set as a panel rather than as loose fields: a gold hairline, a second
 * hairline stamped inside it, and a hard offset shadow, which is the treatment
 * the timed modal already uses. It should read as a card laid on the page,
 * because it is the one thing in the hero a visitor is asked to do.
 *
 * `on-dark` is declared on the panel rather than inherited from whichever band
 * it lands in. The page's grounds alternate by position, so the hero being
 * brown is a fact about where the hero sits and not about the hero itself; add
 * a section above it and the ground flips, and a panel that had merely assumed
 * a dark field would then be putting dark ink on a dark card. Declaring it
 * here keeps the panel and everything the field kit paints inside it correct
 * either way.
 *
 * The country sits on its own row rather than sharing one with the number.
 * This column is about 380px at the widest the page goes, and the two side by
 * side left the number itself around 140px, which is not enough to read back a
 * phone number you have just typed.
 *
 * NOTE: no data-lead-form here, deliberately. That attribute tells the overlay
 * system a form is on screen and suppresses every prompt for as long as it is,
 * and this one is on screen from the first paint, so carrying it would mean
 * the timed prompt never fired on the home page at all. See
 * components/lead/LeadProvider.tsx.
 */
export function HeroContactForm() {
  const idBase = useId()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState(DEFAULT_DIAL_COUNTRY)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const doneRef = useRef<HTMLParagraphElement | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    // All three are reported together rather than one per attempt.
    const nextName = trimmedName ? null : 'Please tell us your name.'
    const nextEmail = isEmailish(trimmedEmail)
      ? null
      : 'Enter an email address we can reply to.'
    const nextPhone = trimmedPhone
      ? null
      : 'Please give us a number we can reach you on.'

    setNameError(nextName)
    setEmailError(nextEmail)
    setPhoneError(nextPhone)

    if (nextName || nextEmail || nextPhone) {
      setFormError(null)
      if (nextName) nameRef.current?.focus()
      else if (nextEmail) emailRef.current?.focus()
      else phoneRef.current?.focus()
      return
    }

    setFormError(null)
    setSending(true)

    const result = await submitLead({
      name: trimmedName,
      email: trimmedEmail,
      phone: formatPhone(country, trimmedPhone) ?? trimmedPhone,
      country: countryLabel(country),
      stage: 'unknown',
      message: message.trim() || undefined,
      source: 'inline',
      ...submissionContext(),
    })

    setSending(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    trackLeadSubmit('inline', 'unknown')
    setDone(true)
    // The form is replaced rather than updated, so focus moves to what took
    // its place instead of a live region announcing a change behind it.
    window.requestAnimationFrame(() => doneRef.current?.focus())
  }

  return (
    <div className="on-dark relative rounded-plate border border-gold bg-bark-deep px-6 py-7 shadow-[0_26px_60px_-28px_rgba(0,0,0,0.8)] sm:px-8 sm:py-9">
      {/* The second hairline, set in from the edge: an imprint page rules its
          block twice, and it is what stops this reading as a plain box. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6px] rounded-[calc(var(--radius-plate)-6px)] border border-gold/35"
      />

      <div className="relative">
        {done ? (
          <>
            <hr className="rule-gold" />
            <p ref={doneRef} tabIndex={-1} className="mt-5 font-display text-h4">
              Thank you, that reached us.
            </p>
            <p className="mt-3 text-small text-ink-soft">
              An editor reads it, not an autoresponder, and writes back within
              one business day with an honest read on your book and a time for
              the call if you want one.
            </p>
          </>
        ) : (
          <>
            <p className="marker text-gold-ink">A free thirty minute call</p>
            <h2 className="mt-3 text-h4">Tell us where your book is</h2>
            <p className="mt-2 text-fine text-ink-soft">
              One editor reads it and replies within a business day. Nothing is
              charged and nothing is committed.
            </p>

            <hr className="rule-quiet mb-6 mt-5" />

            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <TextField
                id={`${idBase}-name`}
                label="Your name"
                required
                autoComplete="name"
                placeholder="First and last"
                value={name}
                onChange={setName}
                inputRef={nameRef}
                error={nameError}
              />
              <TextField
                id={`${idBase}-email`}
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                inputRef={emailRef}
                error={emailError}
              />
              <PhoneField
                idBase={idBase}
                country={country}
                onCountryChange={setCountry}
                phone={phone}
                onPhoneChange={setPhone}
                phoneRef={phoneRef}
                error={phoneError}
              />
              <TextareaField
                id={`${idBase}-message`}
                label="What is giving you trouble"
                rows={2}
                placeholder="A sentence is plenty."
                value={message}
                onChange={setMessage}
              />

              {formError ? (
                <p role="alert" className="text-fine font-medium text-gold-ink">
                  {formError}
                </p>
              ) : null}

              {/* primary-on-dark, not primary. On the bark panel the default
                  primary is a bark fill inside a gold hairline, which is the
                  same two things every field above it is made of, so the one
                  control that does something looked like a sixth input. On
                  this ground the paper block is the foil. */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary-on-dark"
                  size="lg"
                  className="w-full justify-center"
                  aria-disabled={sending || undefined}
                >
                  {sending ? 'Sending' : 'Send this to us'}
                </Button>
              </div>

              <p className="flex items-start gap-2.5 text-fine text-ink-soft">
                <span
                  aria-hidden="true"
                  className="mt-[0.52rem] h-px w-3 shrink-0 bg-gold"
                />
                <span>Your details go to our editorial team and nowhere else.</span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
