import { Seal } from '@/components/brand/Seal'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { contactHref, site } from '@/lib/site'

/**
 * The last band on the page.
 *
 * A reader who has arrived here has read everything, so this band adds no new
 * argument. It is the case binding: a dark brown field ruled in gold at the
 * head and the foot, the seal struck small and centred, one line, one button.
 * On bark, brand gold is legal as ink at 5.5:1, so the gold here is real gold
 * rather than the darkened gold-ink that paper forces.
 *
 * There is no second form in this band. A form here would compete with the one
 * higher up the page and would ask a nervous reader to commit twice. The line
 * under the button says what the call actually is, so pressing it feels like
 * asking a question rather than signing something.
 */

export function ClosingCta() {
  // border-y rather than two <hr> elements: the hairlines are full bleed, so
  // they run the whole width of the band rather than stopping at the gutter.
  return (
    <Section
      id="closing"
      tone="dark"
      size="lg"
      labelledBy="closing-title"
      className="border-y border-gold"
    >
      <Container className="text-center">
        <Seal size={76} className="mx-auto" />

        <h2 id="closing-title" className="mx-auto mt-9 max-w-[19ch] text-h2">
          The next step is a conversation, not a contract.
        </h2>

        <div className="mt-8 flex justify-center">
          <ButtonLink href={contactHref} variant="primary-on-dark" size="lg">
            Book a free call
          </ButtonLink>
        </div>

        <p className="measure mx-auto mt-6 text-small text-paper/80">
          Thirty minutes, no obligation, and a written plan for your book
          afterwards either way.
        </p>

        <hr className="rule-quiet mx-auto mt-10 max-w-[16rem]" aria-hidden="true" />

        {/* PLACEHOLDER contact details. Both come from lib/site.ts, which
            carries a sample number and a sample address until the real ones
            are confirmed. */}
        <p className="mt-7 text-small text-paper/80">
          Not ready to book a slot? Call{' '}
          <a className="link" href={`tel:${site.phoneHref}`}>
            {site.phone}
          </a>{' '}
          or write to{' '}
          <a className="link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </Container>
    </Section>
  )
}
