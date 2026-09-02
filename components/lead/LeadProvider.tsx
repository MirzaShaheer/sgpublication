'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { REVEAL_EVENT, revealedAt } from '@/lib/reveal'

/**
 * One coordinator for every lead capture point on the site.
 *
 * Four capture points exist and none of them may fire on top of another, so
 * exactly one overlay can be open at a time and all of them go quiet the
 * moment a visitor converts. The triggers all live here; the overlay
 * components own only their own presentation and keyboard behaviour, which
 * keeps the "one at a time" rule in a single readable place.
 *
 *   modal   four seconds, 768px and wider   sg_modal_seen, seven days
 *   mobile  fifteen seconds, under 768px    sg_modal_seen, seven days
 *   exit    pointer leaving upward, desktop sg_exit_seen, one per session
 *
 * Because those flags are per browser, the prompt can be seen exactly once
 * and then not again for a week, which makes it look broken to anyone testing
 * it by hand. Two query parameters exist for that: `?lead=reset` makes this
 * browser a first time visitor again, and `?lead=now` does that and skips the
 * delay as well.
 *
 * The modal is deliberately absent under 768px. Google treats an intrusive
 * interstitial on a small screen as a ranking negative when it appears on
 * entry, so the bottom anchored bar takes its place there: same offer, same
 * form, no penalty. The breakpoint is expressed in rem so that the JavaScript
 * and the Tailwind `md:` utilities can never disagree.
 */

export const leadStages = [
  'idea',
  'writing',
  'manuscript_finished',
  'published_not_selling',
  'unknown',
] as const

export type LeadStage = (typeof leadStages)[number]

/** The three overlays. `null` means nothing is open. */
export type LeadOverlay = 'modal' | 'mobile' | 'exit'

type LeadContextValue = {
  overlay: LeadOverlay | null
  /** True once any form anywhere on the site has submitted successfully. */
  converted: boolean
  /** The timed prompt has been shown and closed without converting. */
  timedDismissed: boolean
  /**
   * The step one answer, shared so step two can send it and so a second
   * capture point does not ask the same question again. `null` until the
   * visitor picks an option; a visitor who skips step one stays `null` and is
   * submitted as "unknown".
   */
  stage: LeadStage | null
  setStage: (stage: LeadStage | null) => void
  open: (overlay: LeadOverlay) => void
  openModal: () => void
  openMobile: () => void
  openExit: () => void
  close: () => void
  markConverted: () => void
}

const LeadContext = createContext<LeadContextValue | null>(null)

export function useLead() {
  const value = useContext(LeadContext)
  if (!value) throw new Error('useLead must be used inside <LeadProvider>')
  return value
}

/* ---------------------------------------------------------------------------
   Storage.

   Private browsing, a blocked third party cookie policy and a full quota all
   make localStorage throw on read as well as on write, so every access goes
   through these two functions and neither of them can raise. When the real
   store is unavailable the module level map keeps the same answers for the
   rest of the visit, which is enough to stop an overlay reopening on every
   route change.
   ------------------------------------------------------------------------ */

const memory = new Map<string, string>()

function readStore(kind: 'local' | 'session', key: string): string | null {
  try {
    const store = kind === 'local' ? window.localStorage : window.sessionStorage
    const value = store.getItem(key)
    if (value !== null) return value
  } catch {
    // Fall through to the in memory copy.
  }
  return memory.get(key) ?? null
}

function writeStore(kind: 'local' | 'session', key: string, value: string) {
  memory.set(key, value)
  try {
    const store = kind === 'local' ? window.localStorage : window.sessionStorage
    store.setItem(key, value)
  } catch {
    // In memory only for this visit. Nothing else needs to know.
  }
}

function clearStore(kind: 'local' | 'session', key: string) {
  memory.delete(key)
  try {
    const store = kind === 'local' ? window.localStorage : window.sessionStorage
    store.removeItem(key)
  } catch {
    // The in memory copy is already gone, which is all this visit needs.
  }
}

/** `?lead=reset` or `?lead=now`, read straight off the URL. */
function leadOverride(): 'reset' | 'now' | null {
  const value = new URLSearchParams(window.location.search).get('lead')
  return value === 'reset' || value === 'now' ? value : null
}

const KEY_MODAL_SEEN = 'sg_modal_seen'
const KEY_CONVERTED = 'sg_lead_converted'
const KEY_EXIT_SEEN = 'sg_exit_seen'

/*
 * How long the timed prompt stays quiet after it has been shown once.
 *
 * Zero, so it comes back on every visit and every reload. It was seven days,
 * which is the kinder setting for a real visitor and the reason the prompt
 * appeared to be broken: it fires once, writes its flag, and then does not
 * come back for a week no matter how many times the page is reloaded.
 *
 * Set this to `7 * 24 * 60 * 60 * 1000` to have the quiet week back. Nothing
 * else has to change: the flag is still written on every firing, so the only
 * thing this constant governs is how long it is honoured.
 */
const MODAL_TTL_MS = 0
const MODAL_DELAY_MS = 4_000
const BAR_DELAY_MS = 15_000

/** Longest the prompt will wait to be told the page was revealed. */
const REVEAL_BACKSTOP_MS = 6_000

const DESKTOP_QUERY = '(min-width: 48rem)' // matches Tailwind's md:
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * How long ago the timed prompt was last shown, or null if it never was. A
 * stored value older than seven days is treated as never shown, which is what
 * lets the prompt come back for a returning visitor.
 */
function timedPromptSeenWithinTtl() {
  // No quiet period at all: nothing counts as seen, so the prompt is due on
  // every visit. Guarded here rather than by arithmetic below so that a zero
  // cannot be defeated by a clock that has gone backwards.
  if (MODAL_TTL_MS <= 0) return false
  const raw = readStore('local', KEY_MODAL_SEEN)
  if (!raw) return false
  const at = Number(raw)
  // An unparseable value is treated as recent rather than as absent: a broken
  // timestamp should suppress the prompt, never spam it.
  if (!Number.isFinite(at)) return true
  return Date.now() - at < MODAL_TTL_MS
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<LeadOverlay | null>(null)
  const [converted, setConverted] = useState(false)
  const [timedDismissed, setTimedDismissed] = useState(false)
  const [stage, setStage] = useState<LeadStage | null>(null)
  /** Storage has been read. Nothing may fire before it has. */
  const [ready, setReady] = useState(false)

  const pathname = usePathname()

  /* Refs the trigger effects read. Keeping these out of the dependency arrays
     stops a form scrolling past from tearing down and rebuilding the timers. */
  const overlayRef = useRef<LeadOverlay | null>(null)
  const convertedRef = useRef(false)
  const formInViewRef = useRef(false)

  useEffect(() => {
    overlayRef.current = overlay
  }, [overlay])

  useEffect(() => {
    convertedRef.current = converted
  }, [converted])

  /** Nothing opens on the contact page, where a form is the whole point. */
  const onContactRoute =
    pathname === '/contact' || pathname.startsWith('/contact/')

  const open = useCallback((next: LeadOverlay) => {
    setOverlay((current) => (current === null ? next : current))
  }, [])

  const openModal = useCallback(() => open('modal'), [open])
  const openMobile = useCallback(() => open('mobile'), [open])
  const openExit = useCallback(() => open('exit'), [open])

  /**
   * Closing is always a dismissal, never a conversion. That is what arms the
   * exit prompt: the visitor saw the offer and said no, so one smaller ask on
   * the way out is fair. A visitor who converted never reaches here.
   */
  const close = useCallback(() => {
    if (overlayRef.current === 'modal' || overlayRef.current === 'mobile') {
      setTimedDismissed(true)
      writeStore('local', KEY_MODAL_SEEN, String(Date.now()))
    }
    setOverlay(null)
  }, [])

  const markConverted = useCallback(() => {
    convertedRef.current = true
    setConverted(true)
    writeStore('local', KEY_CONVERTED, String(Date.now()))
    // The overlay stays open on purpose: the success message inside it is the
    // last thing the visitor needs to read.
  }, [])

  /* Read storage after mount, never during render, so the server markup and
     the first client render agree and nothing hydrates mismatched. */
  useEffect(() => {
    // The reset runs before the reads below, so a reset visitor is genuinely
    // indistinguishable from a first time one.
    if (leadOverride()) {
      clearStore('local', KEY_MODAL_SEEN)
      clearStore('local', KEY_CONVERTED)
      clearStore('session', KEY_EXIT_SEEN)
    }

    if (readStore('local', KEY_CONVERTED)) {
      convertedRef.current = true
      setConverted(true)
    }
    // A prompt already seen inside the seven day window will not fire again,
    // so the exit prompt is armed straight away for this visit.
    if (timedPromptSeenWithinTtl()) setTimedDismissed(true)
    setReady(true)
  }, [])

  /* Any lead form on screen suppresses every overlay: a visitor already
     looking at a form is never interrupted with a second one. Forms opt in by
     carrying data-lead-form, so they never have to register themselves. The
     query is repeated on every route change because the forms differ by
     route. */
  useEffect(() => {
    const targets = document.querySelectorAll('[data-lead-form]')
    formInViewRef.current = false
    if (targets.length === 0) return

    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      formInViewRef.current = visible.size > 0
    })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [pathname])

  /* ---- the timed prompt ------------------------------------------------ */
  /* Four seconds and a modal on desktop, fifteen seconds and a bottom bar
     under 768px, one shared seven day flag so a visitor who resizes is not
     asked twice. The deadline is measured from when the effect mounted, so
     crossing the breakpoint changes which overlay is due without restarting
     the clock.

     Four seconds is measured from mount, not from the end of the opening
     shelf, which stands for just under two of them. The prompt therefore
     arrives about two seconds after the page is revealed, which is the
     intent: long enough to have seen the headline, not long enough to have
     started reading properly and be interrupted. */
  useEffect(() => {
    if (!ready || onContactRoute || converted) return

    // `?lead=now` skips the wait. The seven day flag has already been cleared
    // by the mount effect above, so only the delay is left to skip.
    const immediate = leadOverride() === 'now'
    if (!immediate && timedPromptSeenWithinTtl()) return

    const media = window.matchMedia(DESKTOP_QUERY)

    /* The clock runs from the moment the page was revealed, not from the
       moment this mounted. The opening shelf stands over the site for its
       first two seconds, so four seconds counted from here would put the
       prompt on screen barely two seconds after the visitor first saw
       anything. Null until the shelf is off; the reveal listener below starts
       the count. `?lead=now` does not wait for anything. */
    let startedAt: number | null = immediate ? Date.now() : revealedAt()
    let timer: number | undefined
    let attempts = 0
    let fired = false

    /* Reasons to hold off, all of them the visitor's own doing: they already
       converted, something else is already open, or they are looking at a
       form. A hidden tab is deliberately NOT in here. */
    const blocked = () =>
      convertedRef.current ||
      overlayRef.current !== null ||
      formInViewRef.current

    const attempt = () => {
      if (fired) return

      /* A backgrounded tab is not a refusal: the visitor has not seen the page
         yet, so this does not spend an attempt and does not reschedule. The
         visibilitychange listener below picks it straight back up when they
         return, which is what stops the prompt being lost for the whole page
         view just because someone tabbed away while it counted down. */
      if (document.visibilityState === 'hidden') return

      attempts += 1
      if (blocked()) {
        // Try again shortly rather than losing the capture point entirely.
        // Bounded, so a visitor parked on a form is left alone.
        if (attempts < 12) timer = window.setTimeout(attempt, 5_000)
        return
      }
      fired = true
      writeStore('local', KEY_MODAL_SEEN, String(Date.now()))
      setOverlay(media.matches ? 'modal' : 'mobile')
    }

    const schedule = () => {
      if (fired) return
      window.clearTimeout(timer)
      // Still behind the shelf. onReveal starts the count.
      if (startedAt === null) return
      const wanted = immediate ? 0 : media.matches ? MODAL_DELAY_MS : BAR_DELAY_MS
      timer = window.setTimeout(
        attempt,
        Math.max(0, wanted - (Date.now() - startedAt)),
      )
    }

    const onReveal = () => {
      startedAt = revealedAt() ?? Date.now()
      schedule()
    }

    // Coming back to the tab re-runs the clock, which is already expired by
    // then, so the prompt appears on return rather than never.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') schedule()
    }

    schedule()
    /* The reveal is the opening shelf's to announce. If it ever stops
       announcing it, through a change to that component or an engine that
       never runs its animation, the prompt must not be stranded waiting for a
       message that is not coming. This is the backstop, and in the ordinary
       case the event has already fired long before it. */
    let revealBackstop: number | undefined
    if (startedAt === null) {
      window.addEventListener(REVEAL_EVENT, onReveal, { once: true })
      revealBackstop = window.setTimeout(onReveal, REVEAL_BACKSTOP_MS)
    }
    media.addEventListener('change', schedule)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(revealBackstop)
      window.removeEventListener(REVEAL_EVENT, onReveal)
      media.removeEventListener('change', schedule)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ready, onContactRoute, converted])

  /* Crossing the breakpoint while an overlay is open must never strand it in
     the wrong mode: a modal below 768px is exactly the interstitial we are
     avoiding, and the bottom bar has no reason to exist above it. The step one
     answer survives the swap because this provider owns it. */
  useEffect(() => {
    if (overlay === null) return
    const media = window.matchMedia(DESKTOP_QUERY)

    const onChange = () => {
      if (media.matches) {
        if (overlayRef.current === 'mobile') setOverlay('modal')
      } else {
        if (overlayRef.current === 'modal') setOverlay('mobile')
        // The exit prompt has no small screen form. It simply goes away.
        if (overlayRef.current === 'exit') setOverlay(null)
      }
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [overlay])

  /* ---- exit intent ----------------------------------------------------- */
  /* Desktop, mouse driven, once per session, and only after the timed prompt
     was dismissed without converting. The pointer has to leave through the top
     of the window with nothing underneath it, which is what separates a
     visitor heading for the address bar from one reaching sideways for a
     second monitor or dropping into a native select. */
  useEffect(() => {
    if (!ready || onContactRoute || converted || !timedDismissed) return
    if (!window.matchMedia(DESKTOP_QUERY).matches) return
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return
    if (readStore('session', KEY_EXIT_SEEN)) return

    // The pointer must have been inside the document at least once, so a
    // window that opens with the cursor already off the top does not count.
    let entered = false

    const onMove = (event: MouseEvent) => {
      if (event.clientY > 8) entered = true
    }

    const onOut = (event: MouseEvent) => {
      if (!entered) return
      if (event.clientY > 0) return
      // relatedTarget is set when the pointer moved to another element rather
      // than out of the document.
      if (event.relatedTarget) return
      const target = event.target
      // An open native select and an embedded frame both report a null
      // relatedTarget on some browsers. Neither is the visitor leaving.
      if (target instanceof Element && target.closest('select, iframe')) return
      if (convertedRef.current) return
      if (formInViewRef.current) return
      if (overlayRef.current !== null) return

      writeStore('session', KEY_EXIT_SEEN, '1')
      setOverlay('exit')
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [ready, onContactRoute, converted, timedDismissed])

  /* A route change closes the two dialogs, because a trapped panel must never
     outlive the page it interrupted. The collapsed bottom bar is not a dialog
     and is left alone, so navigating does not silently burn the capture point.
     Landing on the contact page closes everything. */
  useEffect(() => {
    const current = overlayRef.current
    if (current === null) return
    if (onContactRoute || current !== 'mobile') close()
  }, [pathname, onContactRoute, close])

  const value = useMemo<LeadContextValue>(
    () => ({
      overlay,
      converted,
      timedDismissed,
      stage,
      setStage,
      open,
      openModal,
      openMobile,
      openExit,
      close,
      markConverted,
    }),
    [
      overlay,
      converted,
      timedDismissed,
      stage,
      open,
      openModal,
      openMobile,
      openExit,
      close,
      markConverted,
    ],
  )

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>
}
