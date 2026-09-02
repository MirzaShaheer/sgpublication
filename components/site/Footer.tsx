import Link from 'next/link'
import { Seal } from '@/components/brand/Seal'
import { Container } from '@/components/ui/Section'
import { footerNav, site } from '@/lib/site'

/** The colophon: seal, imprint, full sitemap, and the small print. */
export function Footer() {
  const year = 2026 // PLACEHOLDER: swap for new Date().getFullYear() if a dynamic year is wanted.

  return (
    <footer className="on-dark bg-bark-deep pb-6 pt-6 sm:pt-7">
      <Container>
        <hr className="rule-pair mb-6" />

        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <Seal size={72} />
            <p className="mt-5 font-display text-h4">SG Publication</p>
            <p className="measure mt-2 max-w-[30ch] text-small text-paper/70">
              A full service publishing house for first time authors. Idea,
              writing, production, publishing, marketing, management.
            </p>
            <address className="mt-6 not-italic text-small text-paper/70">
              {/* PLACEHOLDER address */}
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}{' '}
              {site.address.postalCode}
            </address>
            <p className="mt-4 text-small">
              <a className="link" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>
              <br />
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="marker text-gold">{column.heading}</h2>
                <hr className="rule-quiet mt-3" />
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item) => (
                    <li key={`${column.heading}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="text-small text-paper/78 underline-offset-[0.35em] transition-colors duration-200 hover:text-paper hover:underline hover:decoration-gold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <hr className="rule-quiet mt-8" />

        <div className="flex flex-col gap-4 pt-5 text-fine text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a
                className="underline-offset-[0.35em] hover:text-paper hover:underline hover:decoration-gold"
                href={site.social.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                className="underline-offset-[0.35em] hover:text-paper hover:underline hover:decoration-gold"
                href={site.social.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="underline-offset-[0.35em] hover:text-paper hover:underline hover:decoration-gold"
                href={site.social.youtube}
                rel="noopener noreferrer"
                target="_blank"
              >
                YouTube
              </a>
            </li>
            <li>
              <Link
                className="underline-offset-[0.35em] hover:text-paper hover:underline hover:decoration-gold"
                href="/privacy"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                className="underline-offset-[0.35em] hover:text-paper hover:underline hover:decoration-gold"
                href="/terms"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}
