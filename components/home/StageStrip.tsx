import { JourneyObject } from '@/components/home/JourneyObject'
import { journey } from '@/content/journey'

/**
 * The whole arc, in one glance.
 *
 * The six stages below this strip run to about a page each, which is right for
 * someone comparing stage four with stage two and wrong for someone who has
 * just arrived and wants to know what they are looking at. So the strip states
 * the shape of the thing first: six objects in a row, each one further along
 * the same transformation, with the stage number, its name and how long it
 * takes.
 *
 * It doubles as the contents. Every item is an anchor into the full stage
 * further down, so a reader who only wants stage five can go straight there
 * instead of scrolling past four of them.
 *
 * The objects are the same drawing the full stages use, held still and set
 * small. They are decorative here because the name and timeframe beside each
 * one say the same thing in words, so the svg is hidden from assistive
 * technology and the link text carries the meaning.
 */

export function StageStrip() {
  return (
    <nav aria-label="The six stages" className="mt-10 sm:mt-12">
      <hr className="rule-gold" aria-hidden="true" />
      <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-6 lg:gap-x-5">
        {journey.map((stage) => (
          <li key={stage.id}>
            <a
              href={`#${stage.id}`}
              className="group block focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="block transition-transform duration-300 ease-page group-hover:-translate-y-1"
              >
                {/* Its own id namespace: six of these sit on the page at once
                    alongside the six full size ones further down. */}
                <JourneyObject
                  state={stage.objectState}
                  still
                  idSuffix={`strip-${stage.id}`}
                  className="w-full"
                />
              </span>

              <span className="mt-2 block">
                <hr className="rule-quiet" aria-hidden="true" />
                <span className="marker mt-3 block text-gold-ink">
                  Stage {stage.index}
                </span>
                <span className="mt-1.5 block font-display text-h4 underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page group-hover:decoration-gold group-focus-visible:decoration-gold">
                  {stage.name}
                </span>
                <span className="mt-1.5 block text-fine text-ink-soft">
                  {stage.shortTimeframe}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
