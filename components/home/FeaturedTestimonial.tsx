import { BookObject } from '@/components/brand/BookObject'
import { coverPalettes, GeneratedCover } from '@/components/brand/GeneratedCover'
import { Container, Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { books } from '@/content/books'
import { featuredTestimonial } from '@/content/testimonials'

/**
 * One author, given a whole band.
 *
 * A row of six clipped quotes proves nothing to a reader who is afraid of
 * being taken advantage of, because six short quotes are exactly what a
 * dishonest company can invent. So this section runs one testimonial at its
 * full length and lets the reader watch the arc: the problem, the thing that
 * changed it, the fear that was resolved, the result. The sentences are set as
 * separate paragraphs in the display serif so that arc is visible before a word
 * is read.
 *
 * The quote hangs its opening mark into the left margin, the way a set page
 * hangs punctuation. The attribution sits below a gold hairline as a jacket
 * flap plate: a drawn author plate, the name, the book, and the result stated
 * as a fact rather than as a boast.
 *
 * PLACEHOLDER: every testimonial in content/testimonials.ts is invented sample
 * content, and the portrait below is a drawn plate rather than a photograph.
 * Replace both with real, permissioned material before launch.
 */

const featured = featuredTestimonial

/* The featured book already exists in the portfolio, so the cover here resolves
   to the same artwork the grid above renders rather than to a second design of
   the same title. */
const portfolioBook = books.find(
  (book) =>
    book.title === featured.bookTitle && book.author === featured.name,
)

const coverSeed = portfolioBook?.slug ?? featured.id

/* The spine has to be bound in the same stock as the cover, so the palette is
   resolved here the way GeneratedCover resolves it internally: the named index
   if the book declares one, otherwise the same small hash of the seed. */
function paletteIndex(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return Math.floor(h / 7) % coverPalettes.length
}

const palette =
  coverPalettes[
    typeof portfolioBook?.palette === 'number'
      ? portfolioBook.palette % coverPalettes.length
      : paletteIndex(coverSeed)
  ]

/* The arc, sentence by sentence. The third sentence is the one that names a
   fear and then resolves it, which is the sentence a nervous reader is here
   for, so it is given more air above and below than the others carry. */
const sentenceSpacing = ['', 'mt-5 sm:mt-6', 'mt-7 sm:mt-8', 'mt-7 sm:mt-8']

/**
 * PLACEHOLDER portrait. Not a grey circle and not a stock photograph: a plate
 * drawn the way a jacket flap sets an author panel, ruled twice in gold with
 * the initials struck in the display serif. Swap the inner block for a next
 * /image when a real photograph exists, and keep the gold frame.
 */
function PortraitPlate({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/5] w-24 shrink-0 rounded-plate border border-gold bg-paper-2 sm:w-28"
    >
      <span className="absolute inset-[5px] rounded-[calc(var(--radius-plate)-5px)] border border-gold/45" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-[2.125rem] tracking-[0.04em] text-gold-ink sm:text-[2.5rem]">
        {initials}
      </span>
    </div>
  )
}

export function FeaturedTestimonial() {
  return (
    <Section id="testimonial" ruled labelledBy="testimonial-title">
      <Container>
        <h2 id="testimonial-title" className="text-h3">
          One author, at full length
        </h2>

        <figure className="mt-8 sm:mt-10">
          <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
            {/* The opening mark hangs into the margin so the first letter of
                the quote sits on the same axis as every line below it. */}
            <blockquote className="font-display text-quote">
              {featured.quote.map((sentence, index) => (
                <p
                  key={sentence.slice(0, 24)}
                  className={[
                    'measure-wide',
                    index === 0 ? '' : (sentenceSpacing[index] ?? 'mt-7 sm:mt-8'),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={index === 0 ? { textIndent: '-0.44em' } : undefined}
                >
                  {index === 0 ? '\u201C' : null}
                  {sentence}
                  {index === featured.quote.length - 1 ? '\u201D' : null}
                </p>
              ))}
            </blockquote>

            {/* The book itself, at reading-copy size rather than hero size. The
                caption below names the title in text, so the object is hidden
                from assistive technology rather than announced twice. */}
            <div aria-hidden="true" className="lg:pt-2">
              <BookObject
                width="12rem"
                spineTitle={featured.bookTitle}
                spineAuthor={featured.name}
                spineColor={palette.bg2 ?? palette.bg}
                spineInk={palette.accent}
              >
                <GeneratedCover
                  title={featured.bookTitle}
                  author={featured.name}
                  seed={coverSeed}
                  archetype={portfolioBook?.archetype}
                  palette={portfolioBook?.palette}
                  className="block h-full w-full"
                />
              </BookObject>
            </div>
          </div>

          <figcaption className="mt-10 sm:mt-12">
            <hr className="rule-gold" aria-hidden="true" />
            <div className="mt-7 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <PortraitPlate initials={featured.initials} />

              <div>
                <p className="font-display text-h4">{featured.name}</p>
                <p className="mt-1.5 text-small text-ink-soft">
                  {featured.role}
                </p>
                <p className="mt-4 text-small text-ink-soft">
                  <cite className="font-display italic">
                    {featured.bookTitle}
                  </cite>
                </p>
                <p className="marker mt-2 text-ink-soft">
                  {featured.bookGenre}
                </p>
              </div>

              {/* Stated apart from the quote and under its own rule, because a
                  number inside a quotation reads as a claim and a number under
                  a rule reads as a record. */}
              <div className="sm:ml-auto sm:max-w-[19rem]">
                <p className="marker text-gold-ink">Result</p>
                <hr className="rule-quiet mt-3" aria-hidden="true" />
                <p className="mt-3 text-fine text-ink-soft">
                  {featured.result}
                </p>
              </div>
            </div>
          </figcaption>
        </figure>

        <p className="mt-10 sm:mt-12">
          <ButtonLink href="/about#authors" variant="quiet">
            Read what three more authors said
          </ButtonLink>
        </p>
      </Container>
    </Section>
  )
}
