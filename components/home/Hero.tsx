import { HeroContactForm } from '@/components/home/HeroContactForm'
import { HeroJacket } from '@/components/home/HeroJacket'
import { RotatingHeadline } from '@/components/home/RotatingHeadline'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { heroCopy } from '@/content/hero'

/**
 * The first three seconds of the site.
 *
 * The headline is printed on a book cover. It used to sit as plain type at the
 * top of the band with a drawn hardback below it carrying an invented title,
 * which meant the first screen said the same thing twice and ran about four
 * hundred pixels longer for it. One object now: the sentence the visitor came
 * to read, set as the cover of the book they are here to make, with the blurb
 * under it and the imprint at the foot the way a jacket is laid out.
 *
 * What the cover carries and what it does not. Title, rule, blurb, imprint -
 * everything a jacket prints. The two calls to action sit under the board,
 * because a button on a cover is neither: it is not printing, and a visitor
 * would not know whether they were being shown an object or offered a control.
 *
 * The right column is the short contact form. No form above the fold used to
 * be the rule here; it is one now because the whole first screen is the offer,
 * and asking is what the screen is for. The three notes beneath the jacket are
 * what the leader lines on the old illustration said, kept because they name
 * the work and are the only place on this screen that does.
 *
 * The band closes on a quiet line of trust text above a rule, which becomes
 * the fold edge of the page.
 */

export function Hero() {
  /* The top padding exists to clear the sticky masthead, which floats
     transparently over this band, and to do nothing else. */
  return (
    <Section
      tone="paper"
      size="lg"
      labelledBy="hero-heading"
      className="pt-[5.5rem] lg:pt-20"
    >
      <Container>
        {/* The left column takes more of the row than it used to. The jacket
            has to hold display type at a readable size inside its own board
            and padding, and "finished manuscript" is the longest thing it has
            to fit; the form loses width it was not using. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)] lg:gap-x-10 xl:gap-x-20">
          <div className="min-w-0">
            <HeroJacket>
              <RotatingHeadline
                /* Sized to the board rather than to the window, and sized up
                   from where it started: at the smaller step the title only
                   filled the top third of the cover, which is what left the
                   board looking stretched. The cap is what "finished
                   manuscript", the longest word the slot cycles through,
                   fits inside the narrowest column the jacket is ever set
                   in, with its padding and its spine taken off. */
                className="text-[clamp(1.4rem,5.2vw,2.5rem)] leading-[1.06] tracking-[-0.018em] lg:text-[clamp(1.6rem,3.9vw,3rem)]"
              />

              <hr className="rule-gold mt-7 sm:mt-8" />

              <p className="mt-6 max-w-[46ch] text-body text-ink-soft">
                {heroCopy.body}
              </p>

              {/* The imprint, stamped at the foot of the board where a jacket
                  names its publisher. */}
              <p className="marker mt-7 text-gold-ink sm:mt-8">
                {heroCopy.imprintLine}
              </p>
            </HeroJacket>

            {/* What the leader lines used to say, now a line of notes under
                the object they pointed at. Each keeps its gold dot, which is
                what is left of the mark that anchored it to the drawing. */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-display text-fine italic text-ink-soft">
              {heroCopy.annotations.map((annotation) => (
                <li
                  key={annotation.target}
                  className="flex items-center gap-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  {annotation.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              <ButtonLink
                href={heroCopy.primaryCta.href}
                variant="primary"
                size="lg"
              >
                {heroCopy.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={heroCopy.secondaryCta.href} variant="quiet">
                {heroCopy.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <div className="min-w-0">
            <HeroContactForm />
          </div>
        </div>

        <p className="measure-wide mt-10 text-fine text-ink-soft sm:mt-12">
          {heroCopy.trustLine}
        </p>
        <hr className="rule-quiet mt-5" />
      </Container>
    </Section>
  )
}
