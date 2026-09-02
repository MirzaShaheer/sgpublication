import { HeroBook } from '@/components/home/HeroBook'
import { HeroContactForm } from '@/components/home/HeroContactForm'
import { RotatingHeadline } from '@/components/home/RotatingHeadline'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { heroCopy } from '@/content/hero'

/**
 * The first three seconds of the site.
 *
 * The headline opens the page. The seal used to sit above it, and it is gone:
 * the masthead already carries the same seal a few pixels higher, so the
 * second one said nothing new and pushed the sentence a hundred and twenty
 * pixels down the screen for the privilege. The headline names where the
 * visitor is starting from, then two sentences say what is handled, then one
 * button and one quiet link. No form at the top of the page: asking for an
 * email address before explaining anything is how the scams look.
 *
 * The right column is the short contact form. It used to be the book, and the
 * book is now under the copy in the left column: the first screen is where a
 * visitor decides whether to talk to us, and an illustration in the one place
 * the eye lands after the headline was spending that space on decoration. The
 * book still does its job, a step lower, where it illustrates the sentence it
 * belongs to rather than standing in for an ask.
 *
 * The band closes on a quiet line of trust text above a rule, which becomes
 * the fold edge of the page.
 */

export function Hero() {
  /* The top padding exists to clear the sticky masthead, which floats
     transparently over this band, and to do nothing else. The bar is about
     72px tall, so this leaves a little over a line of air above the headline
     and no more: with the seal gone there is nothing here that wants a deep
     opening margin, and the page should start where it looks like it starts. */
  return (
    <Section
      tone="paper"
      size="lg"
      labelledBy="hero-heading"
      className="pt-[5.5rem] lg:pt-24"
    >
      <Container>
        {/* items-start, not items-center: the left column is now taller than
            the form beside it, and centring would float the form halfway down
            the band with its head nowhere near the headline it answers. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-x-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] xl:gap-x-20">
          <div className="min-w-0">
            <RotatingHeadline />

            <p className="measure-wide mt-7 text-lead text-ink-soft">
              {heroCopy.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
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

            {/* The book, under the lines it illustrates. Held to a modest
                width: it is a supporting drawing here, not the thing the
                column is built around, and at full width it would push the
                form on the right badly out of line. */}
            <div className="mt-11 max-w-[26rem] lg:mt-12">
              <HeroBook />
            </div>
          </div>

          {/* The panel is nudged down so its top rule lands on the cap height
              of the headline rather than on the top of the headline's line
              box. items-start aligns the two boxes, but the h1 carries half a
              line of leading above its capitals, so aligned boxes read as a
              panel sitting a little high. The offset is roughly that leading
              at each breakpoint, and it only applies where the two columns
              are actually side by side. */}
          <div className="min-w-0 lg:mt-3 xl:mt-3.5">
            <HeroContactForm />
          </div>
        </div>

        <p className="measure-wide mt-10 text-fine text-ink-soft sm:mt-12">
          {heroCopy.trustLine}
        </p>
        {/* The imprint line: who the house belongs to, stamped small at the
            foot of the first screen where a title page would put it. */}
        <p className="marker mt-4 text-gold-ink">{heroCopy.imprintLine}</p>
        <hr className="rule-quiet mt-5" />
      </Container>
    </Section>
  )
}
