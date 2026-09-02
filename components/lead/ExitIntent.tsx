'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { Seal } from '@/components/brand/Seal'
import { Button } from '@/components/ui/Button'
import {
  PanelCloseButton,
  PhoneField,
  SuccessNote,
  TextField,
  isEmailish,
  submissionContext,
  submitLead,
  useOverlayPanel,
} from '@/components/lead/LeadFields'
import {
  DEFAULT_DIAL_COUNTRY,
  countryLabel,
  formatPhone,
} from '@/lib/lead-schema'
import { useLead } from '@/components/lead/LeadProvider'
import { trackLeadSubmit } from '@/lib/analytics'

/**
 * The last ask, on desktop only, once per session, and only for a visitor who
 * already saw the timed prompt and said no. The provider owns the detection;
 * this file is the panel.
 *
 * A different offer, because repeating one that has already been declined is
 * just nagging. Price is the thing a first time author is most anxious and
 * least informed about, so that is what is on the table here.
 *
 * The panel is deliberately smaller and lighter than the modal: a narrower
 * measure, a quieter shadow, a smaller seal and no second hairline. It should
 * read as a smaller ask, because it is one.
 *
 * It asks for a name, an email address and a number, which is the minimum an
 * editor needs to answer at all, and nothing else. No stage question, no
 * genre, and no message box: this is the last ask on the way out, and every
 * field past the three that are required is one more reason to close the tab.
 */
export function ExitIntent({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { stage, markConverted } = useLead()
  const titleId = useId()
  const fieldId = useId()
  const panelRef = useOverlayPanel(open, onClose)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState(DEFAULT_DIAL_COUNTRY)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const trimmedName = name.trim()
    const trimmed = email.trim()
    const trimmedPhone = phone.trim()

    const nextName = trimmedName ? null : 'Please tell us your name.'
    const nextEmail = isEmailish(trimmed)
      ? null
      : 'Enter an email address we can send the breakdown to.'
    const nextPhone = trimmedPhone
      ? null
      : 'Please give us a number we can reach you on.'

    setNameError(nextName)
    setFieldError(nextEmail)
    setPhoneError(nextPhone)

    if (nextName || nextEmail || nextPhone) {
      setFormError(null)
      if (nextName) nameRef.current?.focus()
      else if (nextEmail) inputRef.current?.focus()
      else phoneRef.current?.focus()
      return
    }

    setFormError(null)
    setSending(true)

    // The stage is whatever step one of the timed prompt captured. A visitor
    // who skipped it is submitted as "unknown".
    const answeredStage = stage ?? 'unknown'

    const result = await submitLead({
      name: trimmedName,
      email: trimmed,
      phone: formatPhone(country, trimmedPhone) ?? trimmedPhone,
      country: countryLabel(country),
      stage: answeredStage,
      source: 'exit',
      ...submissionContext(),
    })

    setSending(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    trackLeadSubmit('exit', answeredStage)
    markConverted()
    setDone(true)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 hidden items-center justify-center p-6 md:flex">
      <div
        role="presentation"
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-bark/60"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[88vh] w-full max-w-[27rem] overflow-y-auto overscroll-contain rounded-plate border border-gold bg-paper-2 px-8 py-8 shadow-modal"
      >
        <div className="relative">
          <PanelCloseButton
            onClose={onClose}
            label="Close this offer"
            className="absolute -right-2 -top-3"
          />

          <Seal size={34} />

          {done ? (
            <div className="mt-5">
              <SuccessNote heading="It is on its way" onClose={onClose}>
                <p>
                  The price breakdown lands in your inbox within a few minutes.
                  If a line in it does not make sense, reply to that email and
                  an editor will answer within one business day.
                </p>
              </SuccessNote>
            </div>
          ) : (
            <>
              <h2 id={titleId} className="mt-5 max-w-[20ch] text-h4">
                Before you go, get the price breakdown
              </h2>
              <p className="mt-3 text-small text-ink-soft">
                What a book actually costs to edit, design, print and launch,
                set out stage by stage with the range for each. One email, and
                no follow up sequence.
              </p>

              <hr className="rule-quiet mt-6 mb-6" />

              <form onSubmit={onSubmit} noValidate>
                <div className="space-y-5">
                  <TextField
                    id={`${fieldId}-name`}
                    label="Your name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={setName}
                    inputRef={nameRef}
                    error={nameError}
                  />
                  <TextField
                    id={fieldId}
                    label="Email address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={setEmail}
                    inputRef={inputRef}
                    error={fieldError}
                  />
                  <PhoneField
                    idBase={fieldId}
                    country={country}
                    onCountryChange={setCountry}
                    phone={phone}
                    onPhoneChange={setPhone}
                    error={phoneError}
                    phoneRef={phoneRef}
                  />
                </div>

                {formError ? (
                  <p role="alert" className="mt-4 text-small font-medium text-gold-ink">
                    {formError}
                  </p>
                ) : null}

                <div className="mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    aria-disabled={sending || undefined}
                  >
                    {sending ? 'Sending' : 'Send me the price breakdown'}
                  </Button>
                </div>

                <p className="mt-5 text-fine text-ink-soft">
                  One email with the breakdown in it. Nothing else.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
