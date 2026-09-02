import { Container, Section, SectionHeading } from '@/components/ui/Section'

/**
 * The problem, in the author's words.
 *
 * This is the empathy band, so it is set as three pull quotes rather than as a
 * grid of feature tiles: display serif at quote size, opening quotation marks
 * hung into the left margin with a negative first line indent so the first
 * letter stays optically aligned, and gold hairlines instead of edges. The
 * three blocks step in and out rather than stacking identically, which gives
 * the section a rhythm on the page.
 *
 * Under each quote sits one quiet line of answer in the body sans, led in by a
 * short gold rule the way a printed attribution is offset. It is deliberately
 * subordinate: the quote is the voice, the answer is the margin note.
 *
 * The head is set the way every other band on the page sets its head, with the
 * running head above it and the rule pair along the top edge of the section.
 * It was previously a step smaller and carried neither, which left it reading
 * as a caption sitting on top of the quotes rather than as the name of a
 * section of its own.
 */

const problems = [
  {
    quote: '\u201CI have written 40,000 words and no idea what happens next.\u201D',
    answer:
      'One editor reads all 40,000 words and comes back with a chapter by chapter plan: what stays, what moves, what is still missing.',
    /* Stepped indents, so the three blocks do not stack identically. */
    indent: '',
  },
  {
    quote:
      '\u201CI got a quote for $18,000 and could not tell what I was paying for.\u201D',
    answer:
      'One number with nothing under it is the problem. Ours is broken out line by line: every pass, who does it, how many revisions, and what you own at the end.',
    indent: 'sm:ml-[10%] lg:ml-[14%]',
  },
  {
    quote: '\u201CI published on Amazon and sold nine copies.\u201D',
    answer:
      'That is what a launch with no reviews, no email list and no categories looks like. Amazon shows a book to strangers only once it is already selling.',
    indent: 'sm:ml-[5%] lg:ml-[7%]',
  },
]

export function ProblemQuotes() {
  return (
    <Section id="the-problem" tone="dark" ruled labelledBy="problem-quotes-title">
      <Container>
        {/* No lede: the three quotes are the lede, and a line of our own prose
            in front of them would be us talking over the author. */}
        <SectionHeading
          id="problem-quotes-title"
          marker="The problem"
          title="What we hear on the first call"
        />

        <div className="mt-8 sm:mt-10">
          {problems.map((problem, index) => (
            <div
              key={problem.quote}
              className={['measure-wide', problem.indent]
                .filter(Boolean)
                .join(' ')}
            >
              <hr
                className={[
                  'rule-gold',
                  index === 0 ? '' : 'mt-8 sm:mt-10',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              <blockquote className="mt-7 sm:mt-9">
                {/* Negative first line indent hangs the opening quotation mark
                    into the margin, so the I of the first word aligns. */}
                <p
                  className="font-display text-quote"
                  style={{ textIndent: '-0.42em' }}
                >
                  {problem.quote}
                </p>
              </blockquote>
              <div className="mt-5 flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-[0.7rem] h-px w-6 shrink-0 bg-gold"
                />
                <p className="measure text-small text-paper/75">
                  {problem.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
