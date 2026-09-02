'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { PhoneField } from '@/components/lead/LeadFields'
import { Button } from '@/components/ui/Button'
import { trackLeadSubmit } from '@/lib/analytics'
import {
  budgetOptions,
  countryLabel,
  formatPhone,
  genreOptions,
  stageChoices,
  DEFAULT_DIAL_COUNTRY,
  type AuthorStageValue,
} from '@/lib/lead-schema'

/**
 * The full form on /contact. It asks for more than the inline one because a
 * visitor who has navigated here has already decided to talk to us, and every
 * answer here is a question an editor would otherwise have to ask on the call.
 *
 * Two decisions worth keeping. The word count is marked optional in the label
 * itself, because a good share of the people filling this in have not written
 * a word yet and should not feel behind. And the budget list ends with "I do
 * not know yet", written plainly rather than apologetically, because most
 * first time authors genuinely have no idea what a book costs.
 *
 * The wrapper carries `data-lead-form`, which the overlay system watches: no
 * modal, bar or exit prompt opens while a form is on screen.
 */

/* The shared control, defined once in globals.css. This file used to carry
   its own underlined variant, which is why the contact page read as a
   different site from the popup. */
const fieldClass = 'field'

/* The same small caps label voice the rest of the site's forms use. */
const labelClass = 'marker block text-ink-soft'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^[0-9+()\s-]+$/

type Field =
  | 'name'
  | 'email'
  | 'phone'
  | 'genre'
  | 'wordCount'
  | 'budget'
  | 'message'

const fieldOrder: Field[] = [
  'name',
  'email',
  'phone',
  'genre',
  'wordCount',
  'budget',
  'message',
]

type FocusableField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function ContactForm() {
  const ids = useId()
  const id = (field: string) => `${ids}-${field}`

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  /* This form used to take a bare number with no dialling code, which is a
     number nobody can ring for the third of our authors outside the US. It
     now asks the same way every other form does. */
  const [country, setCountry] = useState(DEFAULT_DIAL_COUNTRY)
  const [stage, setStage] = useState<AuthorStageValue | ''>('')
  const [genre, setGenre] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot, see below

  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const fieldRefs = useRef<Partial<Record<Field, FocusableField | null>>>({})
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
      found.name = 'That name is longer than we can store.'

    if (!email.trim()) found.email = 'We need an email address to reply to.'
    else if (!emailPattern.test(email.trim()))
      found.email = 'That does not look like an email address.'

    if (!phone.trim())
      found.phone = 'Please give us a number we can reach you on.'
    else if (!phonePattern.test(phone.trim()))
      found.phone =
        'A phone number can use digits, spaces, brackets, a plus and a hyphen.'

    if (wordCount.trim()) {
      const parsed = Number(wordCount.replace(/[,\s]/g, ''))
      if (!Number.isFinite(parsed) || parsed < 0)
        found.wordCount = 'Please give the word count as a number, or leave it empty.'
      else if (parsed > 2_000_000)
        found.wordCount = 'That is longer than any book we can publish.'
    }

    if (message.length > 4000)
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
          phone: formatPhone(country, phone) ?? phone,
          country: countryLabel(country),
          stage: stage || 'unknown',
          genre,
          wordCount,
          budget,
          message,
          company,
          source: 'contact',
          path: window.location.pathname,
          referrer: document.referrer || undefined,
        }),
      })

      if (!response.ok) {
        // The route answers 400 with { ok: false, errors } when a value it
        // cares about did not survive the schema. Everything the visitor typed
        // stays exactly where it is.
        let serverErrors: Partial<Record<Field, string>> = {}
        try {
          const body: unknown = await response.json()
          const raw =
            body && typeof body === 'object' && 'errors' in body
              ? (body as { errors?: Record<string, string[]> }).errors
              : undefined
          if (raw) {
            serverErrors = Object.fromEntries(
              fieldOrder
                .filter((field) => raw[field]?.[0])
                .map((field) => [field, raw[field]![0]!]),
            ) as Partial<Record<Field, string>>
          }
        } catch {
          // A response we cannot read falls through to the general message.
        }

        setSending(false)
        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors)
          focusFirstInvalid(serverErrors)
          return
        }
        setFormError(
          'That did not send. Please try again, or email us and we will pick it up from there.',
        )
        return
      }

      trackLeadSubmit('contact', stage || 'unknown')
      setDone(true)
      // The whole form is replaced, so focus moves to the confirmation rather
      // than announcing a swapped region through aria-live.
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
        <p ref={confirmationRef} tabIndex={-1} className="mt-6 font-display text-h3">
          Thank you, that reached us.
        </p>
        <p className="mt-4 text-ink-soft">
          An editor reads every one of these personally. You will have a reply
          by email, usually the same working day and always within one, with an
          honest read on your book and a time for a thirty minute call if you
          want one. Nothing is charged and nothing is committed.
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      data-lead-form
      onSubmit={handleSubmit}
      className="relative measure-wide"
    >
      <h2 className="text-h3">Tell us about your book</h2>
      <p className="mt-3 text-ink-soft">
        The more you write here the more useful our reply is. Your name, email
        address and a number are all we actually need; everything else on this
        page can be left empty.
      </p>

      {/*
        Honeypot. Hidden from people and from screen readers. A bot that fills
        it in gets a normal success response and nothing is written to the
        database. See lib/lead-schema.ts.
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

        <PhoneField
          idBase={id('contact')}
          country={country}
          onCountryChange={setCountry}
          phone={phone}
          onPhoneChange={setPhone}
          phoneRef={(node) => {
            fieldRefs.current.phone = node
          }}
          error={errors.phone}
          hint="In case the email bounces. We do not ring without asking first."
        />

        <div>
          <label className={labelClass} htmlFor={id('genre')}>
            What kind of book it is (optional)
          </label>
          <input
            ref={(node) => {
              fieldRefs.current.genre = node
            }}
            id={id('genre')}
            name="genre"
            type="text"
            list={id('genre-list')}
            className={`${fieldClass} mt-2`}
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            aria-invalid={errors.genre ? true : undefined}
            aria-describedby={
              errors.genre ? id('genre-error') : id('genre-hint')
            }
          />
          {/* A list to pick from, and a field you can type anything into. */}
          <datalist id={id('genre-list')}>
            {genreOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          {errors.genre ? (
            <p id={id('genre-error')} className="mt-2 text-small text-gold-ink">
              {errors.genre}
            </p>
          ) : (
            <p id={id('genre-hint')} className="mt-2 text-fine text-ink-soft">
              Pick from the list or write your own.
            </p>
          )}
        </div>
      </div>

      <fieldset className="mt-10">
        <legend className="marker text-ink-soft">
          Where the book is right now
        </legend>
        <div className="mt-4">
          {stageChoices.map((choice) => (
            <label
              key={choice.value}
              className="flex cursor-pointer items-baseline gap-3 border-b border-paper-3 py-4"
            >
              <input
                type="radio"
                name={id('stage')}
                value={choice.value}
                checked={stage === choice.value}
                onChange={() => setStage(choice.value)}
                className="accent-gold-ink"
              />
              <span>
                <span className="block text-body">{choice.label}</span>
                <span className="mt-1 block text-small text-ink-soft">
                  {choice.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={id('wordCount')}>
            Words written so far (optional)
          </label>
          <input
            ref={(node) => {
              fieldRefs.current.wordCount = node
            }}
            id={id('wordCount')}
            name="wordCount"
            type="text"
            inputMode="numeric"
            placeholder="50,000"
            className={`${fieldClass} mt-2`}
            value={wordCount}
            onChange={(event) => setWordCount(event.target.value)}
            aria-invalid={errors.wordCount ? true : undefined}
            aria-describedby={
              errors.wordCount ? id('wordCount-error') : id('wordCount-hint')
            }
          />
          {errors.wordCount ? (
            <p
              id={id('wordCount-error')}
              className="mt-2 text-small text-gold-ink"
            >
              {errors.wordCount}
            </p>
          ) : (
            <p id={id('wordCount-hint')} className="mt-2 text-fine text-ink-soft">
              Leave this empty if nothing is written yet. Most people do.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor={id('budget')}>
            Budget you have in mind (optional)
          </label>
          <select
            ref={(node) => {
              fieldRefs.current.budget = node
            }}
            id={id('budget')}
            name="budget"
            className={`${fieldClass} mt-2`}
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            aria-invalid={errors.budget ? true : undefined}
            aria-describedby={
              errors.budget ? id('budget-error') : id('budget-hint')
            }
          >
            <option value="">Choose one</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.budget ? (
            <p id={id('budget-error')} className="mt-2 text-small text-gold-ink">
              {errors.budget}
            </p>
          ) : (
            <p id={id('budget-hint')} className="mt-2 text-fine text-ink-soft">
              Not knowing yet is a normal answer, and one of the options.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label className={labelClass} htmlFor={id('message')}>
          What is the book about, and what is giving you trouble (optional)
        </label>
        <textarea
          ref={(node) => {
            fieldRefs.current.message = node
          }}
          id={id('message')}
          name="message"
          rows={6}
          className={`${fieldClass} mt-2 resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? id('message-error') : id('message-hint')
          }
        />
        {errors.message ? (
          <p id={id('message-error')} className="mt-2 text-small text-gold-ink">
            {errors.message}
          </p>
        ) : (
          <p id={id('message-hint')} className="mt-2 text-fine text-ink-soft">
            A few lines is plenty. Nobody is marking this.
          </p>
        )}
      </div>

      <hr className="rule-quiet mt-10" />

      {formError ? (
        <p className="mt-6 text-small text-gold-ink">{formError}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? 'Sending' : 'Send this to us'}
        </Button>
        <p className="text-fine text-ink-soft">
          One editor reads it. We never sell your details.
        </p>
      </div>
    </form>
  )
}
