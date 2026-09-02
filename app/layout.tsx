import type { Metadata, Viewport } from 'next'
import { Karla, Newsreader } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { LeadProvider } from '@/components/lead/LeadProvider'
import { LeadOverlays } from '@/components/lead/LeadOverlays'
import { ShelfCurtain } from '@/components/site/ShelfCurtain'
import { DragScroll } from '@/components/site/DragScroll'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl, site, siteUrl } from '@/lib/site'

/**
 * Both families are self hosted through next/font, so there is no request to
 * fonts.googleapis.com at runtime and no flash of unstyled text.
 * Display: Newsreader, a transitional serif with real personality.
 * Body: Karla, a quiet humanist sans.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const karla = Karla({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-karla',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SG Publication, book publishing for first time authors',
    template: '%s | SG Publication',
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_US',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: absoluteUrl('/') },
  // Icons and card images all come from file conventions, so there is no
  // hardcoded path here to drift out of date:
  //   app/icon.png             the favicon at 48, with icon1 32 and icon2 16
  //   app/apple-icon.png       180x180, the artwork itself
  //   app/opengraph-image.tsx  1200x630
  //   app/twitter-image.tsx    the same card, re-exported
}

/**
 * The browser chrome matches the ground the page actually opens on, which is
 * now always the light stock: the site no longer follows the operating system
 * on a first visit, so keying this to prefers-color-scheme would paint the
 * chrome dark around a light page for every visitor whose machine is in dark
 * mode. It is one value, and ThemeToggle rewrites it if the visitor chooses
 * dark. #EFE6D6 is --color-paper-2 from globals.css and moves with it.
 */
export const viewport: Viewport = {
  themeColor: '#EFE6D6',
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${karla.variable}`}
      /* data-theme is written by the script below before React hydrates, so
         the server HTML and the client tree disagree about this one attribute
         by design. */
      suppressHydrationWarning
    >
      <head>
        {/*
          Theme, resolved before first paint.

          The site opens light for everyone. Dark is a choice a visitor makes
          here, not a setting inherited from their operating system: this is a
          publishing house on warm uncoated stock, and the light theme is the
          designed article rather than one of two equal options. So the only
          thing this reads is an explicit stored choice.

          It still has to be a blocking inline script in the head. Anything
          later, including an effect in a client component, runs after the
          first paint and would show a light flash to every visitor who HAS
          chosen dark, on every navigation. Two lines, one attribute, and it
          fails closed to light if storage is unavailable.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('sg_theme');document.documentElement.dataset.theme=s==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`,
          }}
        />

        {/*
          Where a reload lands, decided before the browser can decide it.

          A reload has to open the way a first visit opens: the shelf closed
          across the window, and the page at its top behind it. By default a
          browser puts a reload back at the offset it left off at, so the
          shelf would part onto the middle of the page, which is the one thing
          an opening sequence must never do.

          In the head for the same reason the theme script is: the restore
          happens before any effect of ours could run, and correcting it
          afterwards is a visible jump rather than a clean start. Turning
          restoration off before the document has a scroll offset means there
          is nothing to correct.

          Scoped to reloads on purpose, by asking the navigation entry what
          kind of navigation this is. Back and forward still restore where the
          visitor was, because there they are returning to a page they were
          reading rather than starting one again. A URL with a hash needs no
          special case: fragment navigation is not scroll restoration and
          still runs, so /#packages opens on packages.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!('scrollRestoration' in history))return;var e=performance.getEntriesByType('navigation')[0];if(e&&e.type==='reload'){history.scrollRestoration='manual'}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {/*
          First child of the body on purpose. It has to be in the server markup
          so the shelf is already closed on the first paint rather than
          appearing over a page the visitor has started reading, and it has to
          be outside <main> so the band alternation rules never claim it.
        */}
        <ShelfCurtain />
        {/*
          Google Tag Manager slot. Uncomment and set NEXT_PUBLIC_GTM_ID once the
          client supplies a container. lib/analytics.ts already pushes
          lead_submit events into window.dataLayer and is safe without GTM.

          import { GoogleTagManager } from '@next/third-parties/google'
          {process.env.NEXT_PUBLIC_GTM_ID ? (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          ) : null}
        */}
        <OrganizationJsonLd />
        <LeadProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <LeadOverlays />
          <DragScroll />
        </LeadProvider>
      </body>
    </html>
  )
}
