import { ButtonLink } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Section'

/**
 * The differentiator section, set as a comparison rather than as a list of
 * virtues. Six rows, each naming what the industry usually does beside what
 * happens here, because "we are transparent" is a claim and "the ISBN is
 * registered in your name" is a fact a reader can go and check.
 *
 * The left column is deliberately quieter than the right: it is the thing
 * being contrasted, not the thing being sold. No ticks, no crosses, no red and
 * green. Two columns of type separated by rules, the way a printed comparison
 * is set.
 *
 * The prose lives here rather than in /content because it is argument rather
 * than catalogue: there is no other page that renders these six pairs.
 */

const contrasts = [
  {
    subject: 'Royalties',
    usual: 'A percentage of every sale, for the life of the book, often called a partnership.',
    here: 'You keep 100 percent. We are paid once, for the work.',
  },
  {
    subject: 'The accounts and the ISBN',
    usual: 'Registered to the publisher, who then controls your listing, your price and your money.',
    here: 'Registered in your name. Revoke our access tomorrow and the book keeps selling.',
  },
  {
    subject: 'Payment',
    usual: 'The full sum up front, before a word is written.',
    here: 'Milestones tied to delivered work. Stop halfway and you keep what was done.',
  },
  {
    subject: 'Who edits your book',
    usual: 'A team, a pool, or a name you are given after you have paid.',
    here: 'A named editor, with their background, introduced before you sign.',
  },
  {
    subject: 'Bestseller status',
    usual: 'Guaranteed, usually by buying a ranking in a category too small to mean anything.',
    here: 'Never guaranteed. We forecast before launch, then report the real numbers.',
  },
  {
    subject: 'After the launch',
    usual: 'Silence. The invoice is paid and the book is on its own.',
    here: 'A monthly royalty report, and someone watching for the month it starts moving.',
  },
]

export function WhySG() {
  return (
    <Section id="why-sg" tone="paper-2" ruled labelledBy="why-title">
      <Container>
        <SectionHeading
          id="why-title"
          marker="Why SG"
          title="Six questions worth asking every publisher"
          lede="Ask these of everyone you are considering, and get the answers in writing."
        />

        <div className="mt-8 sm:mt-10">
          {/* Column heads, shown from the small breakpoint up where the two
              columns actually sit side by side. */}
          <div className="hidden gap-10 sm:grid sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]">
            <p />
            <p className="marker text-ink-soft">What usually happens</p>
            <p className="marker text-gold-ink">What happens here</p>
          </div>

          <dl className="mt-4">
            {contrasts.map((row) => (
              <div key={row.subject}>
                <hr className="rule-quiet" aria-hidden="true" />
                <div className="grid gap-x-10 gap-y-3 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:py-6">
                  <dt className="marker pt-1 text-ink">{row.subject}</dt>
                  <dd className="text-small text-ink-soft">
                    <span className="marker mb-1.5 block text-ink-soft sm:hidden">
                      Usually
                    </span>
                    {row.usual}
                  </dd>
                  <dd className="text-small">
                    <span className="marker mb-1.5 block text-gold-ink sm:hidden">
                      Here
                    </span>
                    {row.here}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <hr className="rule-gold" />
        </div>

        <p className="mt-8">
          <ButtonLink href="/about" variant="quiet">
            Who you would actually be working with
          </ButtonLink>
        </p>
      </Container>
    </Section>
  )
}
