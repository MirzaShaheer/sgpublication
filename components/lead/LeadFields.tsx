'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { Button } from '@/components/ui/Button'
import { StageChooser } from '@/components/lead/StageChooser'
import { useLead, type LeadStage } from '@/components/lead/LeadProvider'
import { trackLeadSubmit, type LeadSource } from '@/lib/analytics'
import {
  countryLabel,
  dialCodes,
  formatPhone,
  stageReply,
  DEFAULT_DIAL_COUNTRY,
  type DialCode,
} from '@/lib/lead-schema'
import { contactHref, site } from '@/lib/site'

/**
 * The parts every lead overlay is built from: the three field primitives, the
 * dialog behaviour the modal, the mobile sheet and the exit prompt all share,
 * the one function that posts to /api/lead, and the two step form itself.
 *
 * Fields are set the way a form is printed on paper: a label above, a tinted
 * fill-in area, and a single rule beneath that goes gold when the field has
 * focus. No boxes, no rounded corners, no drop shadows.
 *
 * The offer is a free roadmap and a free call, and deliberately not a
 * discount. A discount popup signals desperation and puts SG in the same
 * bucket as the low trust competitors a first time author is right to be
 * wary of.
 */

export const leadOffer = {
  heading: 'Read the roadmap before you pay anyone',
  lede: 'Twenty pages on what publishing costs, how long it takes, and what to ask before you sign anything. A free thirty minute call comes with it.',
  stageQuestion: 'Where is your book right now?',
  detailsHeading: 'Where should we send it?',
  successHeading: 'It is on its way',
  barTitle: 'The publishing roadmap, free',
  barLine: 'Twenty pages on costs, timing and what to ask. Tap to get it.',
} as const

/* ---------------------------------------------------------------------------
   Dialling codes.

   The list itself now lives in lib/lead-schema.ts beside the rest of the lead
   data, so the popup, the inline form and the contact form all offer the same
   countries and store a number in the same shape. Re-exported here because
   this module is the field kit that the forms import from.
   ------------------------------------------------------------------------ */

export type { DialCode }
export { dialCodes }

const DEFAULT_COUNTRY = DEFAULT_DIAL_COUNTRY

/** Plain language, no publishing jargon, and a way out at the bottom. */
export const genres = [
  'Memoir or life story',
  'Business or leadership',
  'Self help',
  'Health and wellbeing',
  'Faith and spirituality',
  "Children's book",
  'Novel or other fiction',
  'Poetry',
  'History or biography',
  'Cookery',
  'Academic or textbook',
  'Something else',
]

/* ---------------------------------------------------------------------------
   Field primitives
   ------------------------------------------------------------------------ */

/* A tinted fill-in area with a single rule beneath it, the way a field is
   printed on a form. The rule goes gold while the field has focus; the focus
   ring itself comes from globals.css and is never removed. */
/*
 * A field is a label, a tinted fill-in area and a rule beneath it, the way a
 * form is printed on paper. The fill lifts a shade on focus as well as the
 * rule going gold, so the field a visitor is in is obvious at a glance and not
 * only from a two pixel line at its foot.
 */
const controlClass = 'field'

/*
 * Labels are set in the same small caps display face the running heads and the
 * ledger headings use. A form is the one place on this site a visitor is asked
 * to do something, and it should look like it belongs to the same printed
 * object as the rest of the page rather than like a browser default.
 */
const labelClass = 'marker block text-ink-soft'

/**
 * The optional marker, set apart from the label rather than inside it.
 *
 * It used to sit in the label text, which meant the small caps swallowed it
 * and the field read "WHAT IS GIVING YOU TROUBLE (OPTIONAL)" in one run of
 * letterspaced capitals. It is a note about the field, not part of its name,
 * so it is set in the body face at the far end of the row the way a printed
 * form notes an optional line.
 */
function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <label className={labelClass} htmlFor={htmlFor}>
        {children}
      </label>
      {optional ? (
        <span className="text-fine text-ink-soft">Optional</span>
      ) : null}
    </div>
  )
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  optional = false,
  required = false,
  placeholder,
  hint,
  error,
  inputRef,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel'
  optional?: boolean
  required?: boolean
  /** A example of the answer, never a restatement of the label. */
  placeholder?: string
  hint?: string
  error?: string | null
  inputRef?: RefObject<HTMLInputElement | null>
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClass} mt-2`}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-fine text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-fine font-medium text-gold-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * The same field, given room to write in. Used for the one open question
 * every capture point now asks: what the problem actually is, in the
 * visitor's own words. Always optional, so the label always says so.
 */
export function TextareaField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  error,
  textareaRef,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  hint?: string
  error?: string | null
  textareaRef?: RefObject<HTMLTextAreaElement | null>
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <div>
      <FieldLabel htmlFor={id} optional>
        {label}
      </FieldLabel>
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClass} mt-2 resize-y`}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-fine text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-fine font-medium text-gold-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${controlClass} cursor-pointer appearance-none pr-9`}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Decorative: the select is fully operable without it. */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold"
        >
          <path
            d="M1 1l4.5 4.5L10 1"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
        </svg>
      </div>
    </div>
  )
}

/**
 * Phone number, with its dialling code as a segment of the same control.
 *
 * This was two separate fields on two labelled rows, "Country" and "Phone
 * number", which asked the visitor to answer what is really one question in
 * two places and left the pair looking like an oversight rather than a
 * decision. They now share one ruled shell: the code sits at the head of the
 * number, which is where a phone number is written down.
 *
 * The closed control shows the short form, "US +1", because that is all a
 * visitor needs to confirm; the popup lists the full country names, because
 * that is what somebody hunting for the United Arab Emirates needs to read.
 * A native select cannot show two different strings, so the option text is the
 * long one and the select's own text is painted transparent with the short
 * form drawn behind it. The control stays a real <select>: keyboard operable,
 * type ahead works, the platform draws its own picker on a phone, and a screen
 * reader reads the full country name rather than the abbreviation.
 */
export function PhoneField({
  idBase,
  country,
  onCountryChange,
  phone,
  onPhoneChange,
  label = 'Phone number',
  placeholder = 'Your phone number',
  hint,
  error,
  phoneRef,
  className,
}: {
  idBase: string
  country: string
  onCountryChange: (code: string) => void
  phone: string
  onPhoneChange: (value: string) => void
  label?: string
  placeholder?: string
  hint?: string
  error?: string | null
  /** Object or callback ref: the forms differ in how they hold their fields. */
  phoneRef?: Ref<HTMLInputElement>
  className?: string
}) {
  const phoneId = `${idBase}-phone`
  const countryId = `${idBase}-country`
  const hintId = `${phoneId}-hint`
  const errorId = `${phoneId}-error`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined

  const selected =
    dialCodes.find((entry) => entry.code === country) ?? dialCodes[0]

  return (
    <div className={className}>
      <FieldLabel htmlFor={phoneId}>{label}</FieldLabel>

      <div
        className="field-shell mt-2"
        data-invalid={error ? 'true' : undefined}
      >
        <span className="relative shrink-0">
          {/* What a sighted visitor reads. Hidden from assistive technology,
              which is given the select's own value instead. */}
          <span
            aria-hidden="true"
            className="pointer-events-none flex h-full items-center gap-1.5 py-[0.7rem] pl-[0.85rem] pr-7 text-body leading-none"
          >
            <span className="font-medium">{selected.code}</span>
            <span className="text-gold-ink">{selected.dial}</span>
          </span>

          <svg
            aria-hidden="true"
            focusable="false"
            width="10"
            height="6"
            viewBox="0 0 11 7"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gold"
          >
            <path
              d="M1 1l4.5 4.5L10 1"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>

          <label className="sr-only" htmlFor={countryId}>
            Country dialling code
          </label>
          <select
            id={countryId}
            name={countryId}
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            className="field-dial absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent px-0"
          >
            {dialCodes.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.label} ({entry.dial})
              </option>
            ))}
          </select>
        </span>

        <span aria-hidden="true" className="field-seam" />

        <input
          ref={phoneRef}
          id={phoneId}
          name={phoneId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="field-bare w-full min-w-0 flex-1"
        />
      </div>

      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-fine text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-fine font-medium text-gold-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Dialog behaviour, shared by the modal, the expanded mobile sheet and the
   exit prompt.

   Focus moves into the panel, Tab and Shift Tab cycle inside it, anything that
   steals focus outward is pulled back, Escape closes, the page behind cannot
   scroll, and on close focus returns to wherever it came from. A keyboard user
   is never stranded: Escape and the close button are always reachable.
   ------------------------------------------------------------------------ */

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function focusableWithin(panel: HTMLElement) {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.getClientRects().length > 0 &&
      element.getAttribute('aria-hidden') !== 'true',
  )
}

/** Where focus goes when the element that opened the panel has gone away. */
function fallbackFocusTarget(): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(
    `header a[href="${contactHref}"], header button`,
  )
  for (const candidate of candidates) {
    if (candidate.getClientRects().length > 0) return candidate
  }
  return null
}

export function useOverlayPanel(
  open: boolean,
  onClose: () => void,
  returnFocusTo?: RefObject<HTMLElement | null>,
) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const onCloseRef = useRef(onClose)
  const returnToPropRef = useRef(returnFocusTo)

  // Held in refs so a parent re-render cannot tear down the trap and relock
  // the page mid interaction.
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    returnToPropRef.current = returnFocusTo
  })

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    /* Where focus was when the panel opened. The body is discounted on
       purpose: Safari does not focus a button when it is tapped, so on iOS
       this would otherwise return focus to nothing at all and the explicit
       fallback below would never be reached. */
    const active = document.activeElement
    const openedFrom =
      active instanceof HTMLElement && active !== document.body ? active : null

    // The panel itself takes focus first so a screen reader reads the dialog
    // name before its contents. Tab then walks into the panel normally.
    panel.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusableWithin(panel)
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = items[0]!
      const last = items[items.length - 1]!
      const active = document.activeElement
      const index =
        active instanceof HTMLElement ? items.indexOf(active) : -1

      if (event.shiftKey) {
        if (index <= 0) {
          event.preventDefault()
          last.focus()
        }
      } else if (index === -1 || index === items.length - 1) {
        event.preventDefault()
        first.focus()
      }
    }

    // Anything that moves focus out of the panel, including a click on the
    // page behind, is pulled straight back in.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (target instanceof Node && panel.contains(target)) return
      panel.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)

    /* Scroll lock. The width the scrollbar was occupying is handed back to the
       body as padding, so the page underneath does not jump sideways when the
       bar disappears and does not jump back when it returns. */
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gutter > 0) {
      const existing = Number.parseFloat(
        window.getComputedStyle(body).paddingRight || '0',
      )
      body.style.paddingRight = `${(Number.isFinite(existing) ? existing : 0) + gutter}px`
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding

      const explicit = returnToPropRef.current?.current ?? null
      const target =
        openedFrom && openedFrom.isConnected
          ? openedFrom
          : explicit && explicit.isConnected
            ? explicit
            : fallbackFocusTarget()
      target?.focus?.()
    }
  }, [open])

  return panelRef
}

/** The one close control every panel uses. A 44px target, and it says so. */
export function PanelCloseButton({
  onClose,
  label = 'Close',
  className,
}: {
  onClose: () => void
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={[
        'icon-btn flex h-11 w-11 items-center justify-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="sr-only-focusable">{label}</span>
      <svg
        aria-hidden="true"
        focusable="false"
        width="14"
        height="14"
        viewBox="0 0 14 14"
      >
        <path
          d="M1 1l12 12M13 1L1 13"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </button>
  )
}

/* ---------------------------------------------------------------------------
   Submitting
   ------------------------------------------------------------------------ */

export type LeadRequest = {
  name: string
  email: string
  phone: string
  country?: string
  stage: LeadStage
  genre?: string
  wordCount?: number
  budget?: string
  message?: string
  source: LeadSource
  path?: string
  referrer?: string
}

type SubmitResult = { ok: true } | { ok: false; message: string }

function readErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const record = data as Record<string, unknown>
  if (typeof record.error === 'string' && record.error) return record.error
  if (typeof record.message === 'string' && record.message) return record.message
  return null
}

function isAcknowledged(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  return (data as Record<string, unknown>).ok === true
}

/**
 * One submit path for every overlay. A response that is not an acknowledgement
 * and a request that never arrives both surface as a message beside the form.
 * Neither ever closes the panel: a visitor who typed their email must be able
 * to see what happened and try again.
 */
export async function submitLead(body: LeadRequest): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    let data: unknown = null
    try {
      data = await response.json()
    } catch {
      // An empty or non JSON body is handled by the checks below.
    }

    if (response.ok && isAcknowledged(data)) return { ok: true }

    return {
      ok: false,
      message:
        readErrorMessage(data) ??
        'That did not go through. Check the email address and try again.',
    }
  } catch {
    return {
      ok: false,
      message: `That did not send. Check your connection and try again, or email us at ${site.email}.`,
    }
  }
}

/** Everything a form needs to say about where the lead came from. */
export function submissionContext(): { path?: string; referrer?: string } {
  if (typeof window === 'undefined') return {}
  return {
    path: window.location.pathname,
    referrer: document.referrer || undefined,
  }
}

export function isEmailish(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

/* ---------------------------------------------------------------------------
   Success
   ------------------------------------------------------------------------ */

/**
 * Replaces the form once a lead is in. Focus moves to the heading so the
 * change is announced and so focus stays inside the trapped panel; nothing
 * closes on its own.
 */
export function SuccessNote({
  heading,
  children,
  onClose,
}: {
  heading: string
  children: ReactNode
  onClose: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div>
      <hr className="rule-gold" />
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-h3">
        {heading}
      </h3>
      <div className="measure mt-4 space-y-3 text-small text-ink-soft">
        {children}
      </div>
      <div className="mt-7">
        <Button variant="secondary" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   The two step form
   ------------------------------------------------------------------------ */


/**
 * Step one asks the one question a visitor can answer without commitment.
 * Step two is the only step that has to be filled in, and skipping step one
 * simply sends the stage as "unknown".
 *
 * Shared by the desktop modal and the expanded mobile sheet, which is why the
 * source is a prop: both report as "modal", because they are the same offer
 * shown in the shape each screen can take.
 */

/** Which of the three views is showing, so a shell can size its header. */
export type LeadView = 'stage' | 'details' | 'done'

export function LeadCaptureForm({
  source,
  onClose,
  panel = false,
  onViewChange,
}: {
  source: LeadSource
  onClose: () => void
  /**
   * Lay the form out as a panel: the questions take the slack and scroll
   * inside it, the action row is pinned to the foot and does not move.
   *
   * Set by the desktop modal, whose height is capped. Without it every class
   * this switches on is an empty string and the form stacks as it always did,
   * which is what the mobile sheet wants: a sheet scrolls as one piece.
   *
   * The reason it exists at all: at 800px tall the filled in form ran 1159px
   * inside a 702px panel, so the submit button sat 457px below the fold. A
   * visitor who has typed their email should never have to go looking for the
   * button that sends it.
   */
  panel?: boolean
  /** Fires on mount and on every step change. Must be a stable reference. */
  onViewChange?: (view: LeadView) => void
}) {
  const { stage, setStage, markConverted } = useLead()
  const idBase = useId()

  const [step, setStep] = useState<1 | 2>(stage ? 2 : 1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState(DEFAULT_COUNTRY)
  const [genre, setGenre] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const stepOneRef = useRef<HTMLDivElement | null>(null)
  const stepTwoRef = useRef<HTMLHeadingElement | null>(null)
  const firstRender = useRef(true)

  const view: LeadView = done ? 'done' : step === 1 ? 'stage' : 'details'

  /* Moving between steps moves focus with it, so a keyboard user is never left
     pointing at a control that has gone. The first render is skipped: the
     panel has just taken focus itself. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (view === 'stage') stepOneRef.current?.focus()
    if (view === 'details') stepTwoRef.current?.focus()
  }, [view])

  /* Told on mount as well as on every change, so a shell that shrinks its
     header past step one is right from the first paint even when the stage
     was already known and the form opened straight on the details. */
  useEffect(() => {
    onViewChange?.(view)
  }, [view, onViewChange])

  /* ----------------------------------------------------------------------
     Panel layout.

     Three parts: a column that fills the height it is given, a body that
     takes the slack and scrolls, and a foot that keeps its size. Every one
     of them collapses to an empty string when `panel` is off, so the mobile
     sheet and anything else that stacks is untouched.
     -------------------------------------------------------------------- */
  const shellClass = panel ? 'flex min-h-0 flex-1 flex-col' : ''
  const bodyClass = panel
    ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 py-4 sm:px-11'
    : ''
  const footClass = panel
    ? 'shrink-0 border-t border-paper-3 px-8 py-4 sm:px-11'
    : 'mt-7'
  /* Inside a capped panel the rows are pulled in a notch and the reply is let
     out to the full width. Both are there to buy height: at gap-5 with the
     reply held to a 66ch measure the questions ran 138px past the foot on a
     1440x800 laptop, which is the scroll this panel is not supposed to have. */
  const rowGap = panel ? 'gap-4' : 'gap-5'

  function chooseStage(next: LeadStage) {
    setStage(next)
    setStep(2)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    /* All three required fields are checked before any of them is reported,
       so someone who left two of them empty is told about both at once rather
       than being walked round the form one field at a time. Focus lands on
       the first thing that needs fixing. */
    const nextName = trimmedName ? null : 'Please tell us your name.'
    const nextEmail = isEmailish(trimmedEmail)
      ? null
      : 'Enter an email address we can send the roadmap to.'
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
      // The country selector is there to qualify the phone number, and the
      // number is now always given, so the country always travels with it.
      country: countryLabel(country),
      stage: stage ?? 'unknown',
      genre: genre || undefined,
      message: message.trim() || undefined,
      source,
      ...submissionContext(),
    })

    setSending(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    trackLeadSubmit(source, stage ?? 'unknown')
    markConverted()
    setDone(true)
  }

  if (done) {
    return (
      <div className={shellClass}>
        <div className={bodyClass}>
          <SuccessNote heading={leadOffer.successHeading} onClose={onClose}>
            <p>
              The roadmap lands in your inbox within a few minutes. If it is
              not there, look in the spam folder and mark it as safe.
            </p>
            <p>
              A person from our editorial team, not an autoresponder, replies
              within one business day to set up the call.
            </p>
          </SuccessNote>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div
        ref={stepOneRef}
        tabIndex={-1}
        role="group"
        aria-labelledby={`${idBase}-stage-q`}
        className={shellClass}
      >
        <div className={bodyClass}>
          <h3 id={`${idBase}-stage-q`} className="text-h4">
            {leadOffer.stageQuestion}
          </h3>
          {/* Dropped in a panel: with the four answers right underneath it and
              the pitch directly above, this line is telling someone what they
              can already see. The stacked layouts keep it. */}
          {panel ? null : (
            <p className="mt-1.5 text-fine text-ink-soft">
              One question, then your email. Nothing else.
            </p>
          )}
          <div className={panel ? 'mt-3' : 'mt-4'}>
            <StageChooser
              value={stage}
              onChange={chooseStage}
              compact={panel}
            />
          </div>
        </div>

        <div className={footClass}>
          {/* min-h-11 keeps the quiet action a comfortable tap target:
              btn-quiet is a text link and is otherwise about 28px tall. */}
          <Button
            variant="quiet"
            className="min-h-11"
            onClick={() => setStep(2)}
          >
            Skip this question
          </Button>
        </div>
      </div>
    )
  }

  const reply = stageReply(stage)

  return (
    <form onSubmit={onSubmit} noValidate className={shellClass}>
      <div className={bodyClass}>
        {/* The answer to what they just told us, before we ask for anything.
            It used to be set at h4 and ran four lines, which is a lot of a
            capped panel to spend agreeing with someone; the display face
            carries it at the body size just as well. In a panel the shell has
            already ruled a gold hairline above this, so it does not bring its
            own. Absent when the stage question was skipped, since there is
            then nothing to reply to. */}
        {reply ? (
          <div className="mb-5">
            {panel ? null : (
              <hr className="rule-gold mb-3" aria-hidden="true" />
            )}
            <p
              className={[
                'font-display text-small text-ink',
                panel ? '' : 'measure',
              ].join(' ')}
            >
              {reply}
            </p>
          </div>
        ) : null}

        <h3 ref={stepTwoRef} tabIndex={-1} className="text-h4">
          {leadOffer.detailsHeading}
        </h3>

        {/* One grid, two equal columns, so the two short fields share a single
            seam down the middle and everything wider than them spans it. The
            panel used to run these stacked at full width, which is what made
            a form of five questions tall enough to need scrolling. */}
        <div className={`mt-4 grid ${rowGap} sm:grid-cols-2`}>
          <TextField
            id={`${idBase}-name`}
            label="Your name"
            required
            autoComplete="name"
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
            error={phoneError}
            phoneRef={phoneRef}
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <SelectField
              id={`${idBase}-genre`}
              label="What kind of book is it?"
              value={genre}
              onChange={setGenre}
              placeholder="Choose one, or leave it blank"
              options={genres.map((entry) => ({ value: entry, label: entry }))}
            />
          </div>
          <div className="sm:col-span-2">
            {/* The hint is dropped in a panel. "Anything you would like us to
                know (optional)" already says what to type, and a third line of
                guidance under the last field is the cheapest height in the
                form to give back. The stacked layouts keep it. */}
            <TextareaField
              id={`${idBase}-message`}
              label="Anything you would like us to know"
              rows={2}
              value={message}
              onChange={setMessage}
              hint={
                panel
                  ? undefined
                  : 'What you are stuck on, in your own words. A line is plenty.'
              }
            />
          </div>
        </div>
      </div>

      {/* The action is ruled off from the questions, the way a form is ruled
          above the line it is signed on. In a capped panel that rule is the
          top of the pinned foot, so the button is on screen from the moment
          the form opens rather than 450px below it. */}
      <div className={footClass}>
        {formError ? (
          <p role="alert" className="mb-3 text-small font-medium text-gold-ink">
            {formError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button type="submit" size="lg" aria-disabled={sending || undefined}>
            {sending ? 'Sending' : 'Send me the roadmap'}
          </Button>
          {stage ? (
            <Button
              variant="quiet"
              className="min-h-11"
              onClick={() => setStep(1)}
            >
              Change my answer
            </Button>
          ) : null}
        </div>

        <p className="mt-3 text-fine text-ink-soft">
          Your details go to our editorial team and nowhere else. We do not
          sell them or pass them on.
        </p>
      </div>
    </form>
  )
}
