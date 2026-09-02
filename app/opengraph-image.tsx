import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { sealColors } from '@/components/brand/seal-marks'
import { site } from '@/lib/site'

/**
 * The site wide Open Graph card.
 *
 * Three deliberate constraints:
 *
 * 1. No `export const runtime = 'edge'`. The default Node runtime is what runs
 *    inside the standalone Docker output on Railway, and the edge runtime is
 *    not available there. It is also what lets this route read the seal off
 *    disk below.
 * 2. No font is loaded. next/font downloads Newsreader and Karla into the
 *    build output, not to a path this route could read, and fetching a font
 *    over the network would make the build depend on the network. So this
 *    renders in the Noto Sans that ImageResponse ships with, and the design
 *    carries the brand instead of the typeface.
 * 3. The seal is the supplied artwork, inlined as a data URI rather than
 *    linked: satori resolves no relative URL and makes no network request. The
 *    file is read from public/ when the module loads, which holds in dev, in
 *    the build and in the container, since the Dockerfile copies public/ into
 *    the runtime image. It is the wordmark-less copy, because the card sets
 *    the name underneath it in 64px and the seal need not say it twice.
 *
 * ImageResponse supports a subset of CSS: flexbox only, no grid, and any
 * element with more than one child needs an explicit display value.
 */

// Read once, when the module loads, rather than on every render.
const SEAL = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo-mark.png'),
).toString('base64')}`

export const alt =
  'Selune Global Publication. Book publishing for first time authors, from idea to launch.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The palette lives in components/brand/seal-marks, because a route that
// renders outside the document cannot read the @theme tokens in globals.css.
const { bark: BARK, gold: GOLD, goldLight: GOLD_LIGHT, paper: PAPER } =
  sealColors

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BARK,
          position: 'relative',
        }}
      >
        {/* The double rule of a title page: a firm line, then a fainter one. */}
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            border: `1px solid ${GOLD}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 43,
            left: 43,
            right: 43,
            bottom: 43,
            border: '1px solid rgba(201, 151, 63, 0.32)',
            display: 'flex',
          }}
        />

        {/* --- the seal ---------------------------------------------------
            The artwork itself, at the size the SVG redraw used to occupy. */}
        <img src={SEAL} width={188} height={188} alt="" />

        {/* --- wordmark --------------------------------------------------- */}
        <div
          style={{
            marginTop: 30,
            fontSize: 64,
            color: PAPER,
            letterSpacing: -1,
          }}
        >
          {site.name}
        </div>

        {/* A single gold hairline, the same rule the site uses under a heading */}
        <div
          style={{
            marginTop: 24,
            width: 260,
            height: 1,
            backgroundColor: GOLD,
            display: 'flex',
          }}
        />

        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: GOLD_LIGHT,
          }}
        >
          Book publishing for first time authors
        </div>

        {/* The imprint line along the foot: the six stages, in order. */}
        <div
          style={{
            position: 'absolute',
            bottom: 62,
            fontSize: 16,
            letterSpacing: 3,
            color: 'rgba(247, 242, 233, 0.58)',
          }}
        >
          Idea · Manuscript · Production · Publishing · Launch · Ongoing
        </div>
      </div>
    ),
    size,
  )
}
