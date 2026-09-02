'use client'

import { useEffect, useState } from 'react'

/**
 * Light and dark, as a two position capsule switch.
 *
 * Both destinations sit on the track at once, sun at the left and moon at the
 * right, and a gold knob slides between them. The control it replaced showed
 * one icon that swapped on press, which told a visitor that something would
 * change but never where they currently were; this reads at a glance without
 * a label, because the state is the position of the knob.
 *
 * Two states, not three. The site opens light for everyone and dark is a
 * choice made here, so there is no "system" setting to fall back to and the
 * operating system's own preference is deliberately not consulted. A visitor
 * whose machine is in dark mode still lands on the warm stock the site was
 * designed on, and stays there until they press this.
 *
 * The applied theme is written to <html data-theme> by the inline script in
 * app/layout.tsx before first paint, so the page never flashes the wrong
 * ground. This component only reads that attribute back and writes to it.
 *
 * Hydration: the server cannot know the stored preference, so the switch
 * renders in a `pending` state with the knob hidden until mount, rather than
 * guessing a side and sliding across on arrival.
 *
 * The geometry and the travel live in .theme-switch in globals.css. The icons
 * are drawn rather than emoji, on the same 24 unit grid and the same 1.35
 * stroke as the service icon set, so they read as part of the same hand.
 */

const STORAGE_KEY = 'sg_theme'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(currentTheme())
    setMounted(true)
  }, [])

  /* There is no listener on prefers-color-scheme any more. It existed to let
     a visitor who had not chosen follow their operating system; now that the
     site opens light regardless, following the OS mid-session would move the
     ground under someone who never asked for it. */

  const toggle = () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    /* The browser chrome is declared light in app/layout.tsx, because that is
       what the site opens on. Someone who chooses dark would otherwise get a
       cream address bar wrapped around a dark page, so the meta tag moves with
       the choice. Both values are the --color-paper-2 pair from globals.css. */
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', next === 'dark' ? '#2A1C14' : '#EFE6D6')
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode: the choice lasts for this page view only.
    }
  }

  const dark = mounted && theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      /* A switch, not a toggle button: the thing being switched is dark mode,
         and aria-checked says whether it is on. */
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      data-state={mounted ? (dark ? 'dark' : 'light') : 'pending'}
      className="theme-switch"
      title={dark ? 'Switch to light' : 'Switch to dark'}
    >
      <span className="theme-switch-knob" aria-hidden="true" />

      <span className="theme-switch-icon theme-switch-sun" aria-hidden="true">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M4.8 12H2.6M21.4 12h-2.2M6.9 6.9L5.3 5.3M18.7 18.7l-1.6-1.6M17.1 6.9l1.6-1.6M5.3 18.7l1.6-1.6" />
        </svg>
      </span>

      <span className="theme-switch-icon theme-switch-moon" aria-hidden="true">
        {/* The crescent. A moon is the conventional dark mode mark; the seal
            itself carries no crescent. */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M20 14.4A8.4 8.4 0 019.6 4a8.4 8.4 0 1010.4 10.4z" />
        </svg>
      </span>
    </button>
  )
}
