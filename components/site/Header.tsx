'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Seal } from '@/components/brand/Seal'
import { ButtonLink } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { contactHref, primaryNav, site } from '@/lib/site'

/**
 * The masthead, set like the running head of a book.
 *
 * Three zones on a grid so the row never clumps: the imprint lockup at the
 * left, the nav centred in the measure, the call to action at the right. The
 * bar opens transparent over the hero and takes its paper ground, its gold
 * rule and a reading progress hairline once the page has moved, so the first
 * screen stays clean and the sticky state still reads as a deliberate object.
 */
export function Header() {
  const [stuck, setStuck] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  // One scroll handler drives both the stuck state and the progress rule. The
  // rule is written straight to the transform so a scroll never sets React
  // state, and so never re-renders the bar.
  useEffect(() => {
    let frame = 0
    const read = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const travel = doc.scrollHeight - window.innerHeight
      setStuck(scrolled > 24)
      if (progressRef.current) {
        const ratio = travel > 0 ? Math.min(scrolled / travel, 1) : 0
        progressRef.current.style.transform = `scaleX(${ratio})`
      }
      frame = 0
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // While the panel is open: Escape closes it, a click outside closes it, and
  // the page behind it does not scroll.
  useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  /* Which section the reader is level with, so the nav marks where they are
     rather than only where they can go. Every primary nav item is a same page
     anchor, so without this nothing is ever current on the home page.

     The band is the middle tenth of the viewport: a section counts as current
     while its box crosses the reader's eye line, which stops two adjacent
     sections both claiming the mark at a boundary. */
  useEffect(() => {
    const ids = primaryNav
      .map((item) => item.href.split('#')[1])
      .filter((id): id is string => Boolean(id))

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)

    if (targets.length === 0) {
      setActiveId(null)
      return
    }

    // The set is kept rather than the last hit, so when the reader scrolls
    // back up into the hero, where no observed section crosses the band, the
    // mark clears instead of stranding itself on the section they just left.
    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        }
        setActiveId(ids.find((id) => inBand.has(id)) ?? null)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [pathname])

  const isCurrent = (href: string) => {
    const [path, hash] = href.split('#')
    if (hash) {
      // An anchor is current only on the page that carries it.
      return pathname === (path || '/') && activeId === hash
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header
      className={[
        'masthead sticky top-0 z-40',
        // No bg-transparent for the resting state: it is a utility, it beats
        // the .masthead rule in the cascade, and it would knock out the very
        // ground that stops the gutters showing the page through them.
        stuck ? 'masthead-stuck' : '',
      ].join(' ')}
    >
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-4 z-50 rounded-control bg-bark px-4 py-2 text-paper"
      >
        Skip to content
      </a>

      <div
        className={[
          'masthead-bar mx-auto grid w-full max-w-[75rem] items-center',
          // Three tracks. The outer two share the slack so the nav sits on the
          // true centre of the measure, not on the centre of what is left over.
          'grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]',
          'gap-4 px-6 sm:px-8 lg:gap-8 lg:px-12',
          stuck ? 'py-2.5' : 'py-3.5',
        ].join(' ')}
      >
        {/* Imprint lockup. Seal, wordmark, and the descriptor line beneath it,
            set the way a title page names its publisher. */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label={`${site.name}, home`}
        >
          <Seal size={38} priority />
          <span className="hidden flex-col sm:flex">
            <span className="font-display text-[1.0625rem] leading-none tracking-[0.015em]">
              SG Publication
            </span>
            <span className="marker mt-[0.3rem] text-gold-ink transition-colors duration-200 group-hover:text-ink">
              Publishing House
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden justify-center lg:flex"
        >
          <ul className="flex items-center gap-7 xl:gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <ThemeToggle />

          <ButtonLink
            href={contactHref}
            /* Never two lines: at the narrow end of the desktop range the row
               is tight enough that this wrapped into "Book a free / call". */
            className="hidden whitespace-nowrap sm:inline-flex"
          >
            Book a free call
          </ButtonLink>

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle icon-btn -mr-2 flex h-11 w-11 flex-col items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only-focusable">
              {menuOpen ? 'Close menu' : 'Open menu'}
            </span>
            <span className="nav-toggle-bar" aria-hidden="true" />
            <span className="nav-toggle-bar" aria-hidden="true" />
          </button>
        </div>

        <span
          ref={progressRef}
          className="masthead-progress"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      </div>

      {menuOpen ? (
        <div
          id="site-menu"
          ref={panelRef}
          className="nav-panel absolute inset-x-0 top-full overflow-hidden rounded-b-panel border-t border-paper-3 bg-paper-2 shadow-panel lg:hidden"
        >
          <nav
            aria-label="Primary, mobile"
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto px-6 pb-6 pt-2 sm:px-8"
          >
            <ul>
              {primaryNav.map((item, index) => (
                <li
                  key={item.href}
                  className="border-b border-paper-3 last:border-0"
                >
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    /* These are same page anchors, so the pathname never
                       changes and the effect that closes the panel on
                       navigation never fires. Close it here instead. */
                    onClick={() => setMenuOpen(false)}
                    className="nav-panel-item aria-[current=page]:text-gold-ink"
                  >
                    <span className="marker w-4 shrink-0 text-gold-ink">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-5">
              <ButtonLink
                href={contactHref}
                size="lg"
                className="w-full"
                onClick={() => setMenuOpen(false)}
              >
                Book a free call
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
