import type { CSSProperties, ReactNode } from 'react'

import type { JourneyStage } from '@/content/journey'

/**
 * The centre object of the signature section: one object that becomes a book.
 *
 * All six states share a single viewBox and a single construction, so they
 * register with each other and nothing jumps. The view is the one a book gets
 * photographed in on a bindery bench: seen from above and a little in front,
 * lying flat, with the block extruded down and to the right so the fore edge
 * and the tail show. That view is the only one in which a loose stack of paper
 * and a finished hardback are plainly the same object.
 *
 * Continuity is the whole point, so the parts that persist are drawn once and
 * left alone. The text block and its page edges are present in every state.
 * The typed sheet does not cross fade into a book: the boards close around it,
 * then the jacket slides down over the boards, then the sticker is applied.
 * Only opacity, transform and visibility change between states.
 *
 * The contact shadow is identical in all six states, which is what makes the
 * object read as sitting on the same surface throughout. In the last state the
 * book and its shadow travel left together and the chart is drawn beside them.
 *
 * The drawing is decorative. Every stage states in words what is on screen, so
 * the svg is aria-hidden and the caption beside it carries the meaning.
 */

export type ObjectState = JourneyStage['objectState']

const stateOrder: ObjectState[] = [
  'pages',
  'manuscript',
  'blank-book',
  'jacketed',
  'sticker',
  'royalties',
]

/** Long enough to be felt rather than flicked. Books do not snap. */
const DURATION = 580

type LayerProps = {
  show: boolean
  /** Draw the resting state only, with no transitions. */
  still: boolean
  /** Transform for this layer as it stands right now. */
  transform?: string
  /** Milliseconds to hold before this layer arrives. Ignored on the way out. */
  delay?: number
  children: ReactNode
}

/**
 * One state layer. Every layer stays in the DOM at every state, so there is no
 * layout shift and nothing to load between states.
 */
function Layer({ show, still, transform = 'none', delay = 0, children }: LayerProps) {
  if (still) {
    if (!show) return null
    return <g style={{ transform, transformBox: 'fill-box', transformOrigin: 'center' }}>{children}</g>
  }

  const lead = show ? delay : 0
  const style: CSSProperties = {
    opacity: show ? 1 : 0,
    // Visibility flips after the fade, so a spent layer cannot be hit tested.
    visibility: show ? 'visible' : 'hidden',
    transform,
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transition: [
      `opacity ${DURATION}ms var(--ease-page) ${lead}ms`,
      `transform ${DURATION}ms var(--ease-page) ${lead}ms`,
      `visibility 0s linear ${show ? 0 : DURATION}ms`,
    ].join(', '),
  }

  return <g style={style}>{children}</g>
}

/* Page edge positions along the extrusion, deliberately uneven so the block
   reads as paper rather than as a solid. */
const edges = [0.13, 0.27, 0.4, 0.55, 0.68, 0.83]

/* Typed lines on the top sheet: y, width. Two paragraph breaks and a short
   last line, which is what a typed page actually looks like. */
const typedLines: [number, number][] = [
  [104, 112],
  [118, 104],
  [132, 116],
  [146, 88],
  [168, 110],
  [182, 118],
  [196, 96],
  [210, 106],
  [232, 114],
  [246, 62],
]

/* Loose sheets under the top one. Rotation squares up to zero at the bound
   stage, which is the squaring gesture. */
const looseSheets = [
  { rotate: -5.2, x: -10, y: 5 },
  { rotate: 3.6, x: 8, y: -4 },
  { rotate: -1.9, x: 5, y: 7 },
]

/* Royalty bars. Rising, and modestly: this is a decorative mark, not a claim,
   so it carries no numbers and no axis labels. */
const bars = [30, 38, 34, 50, 60, 54, 76]

type JourneyObjectProps = {
  state: ObjectState
  /**
   * Draw only the layers this state needs and drop the transitions. Used by
   * the vertical list, where each stage shows one fixed drawing of its own.
   */
  still?: boolean
  className?: string
  /** Disambiguates gradient and clip ids when several objects share a page. */
  idSuffix?: string
}

export function JourneyObject({
  state,
  still = false,
  className,
  idSuffix,
}: JourneyObjectProps) {
  const rank = stateOrder.indexOf(state)
  const uid = `journey-${idSuffix ?? state}`

  const loose = rank === 0
  const sheet = rank <= 1
  const bound = rank === 1
  const cased = rank >= 2
  const jacketed = rank >= 3
  const stickered = rank >= 4
  const charted = rank === 5

  /* The book and its shadow travel together, so the object keeps sitting on
     the same surface when it makes room for the chart. */
  const carrier: CSSProperties = {
    transform: charted ? 'translateX(-84px)' : 'none',
    ...(still
      ? {}
      : { transition: `transform ${DURATION}ms var(--ease-page)` }),
  }

  return (
    <svg
      viewBox="0 0 440 340"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}-shade`}>
          <stop offset="0" stopColor="#241812" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="#241812" stopOpacity="0.13" />
          <stop offset="1" stopColor="#241812" stopOpacity="0" />
        </radialGradient>
        {/* The light falls from the upper left across every surface. */}
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7F2E9" stopOpacity="0.3" />
          <stop offset="0.45" stopColor="#F7F2E9" stopOpacity="0.05" />
          <stop offset="1" stopColor="#241812" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${uid}-sheet`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#F7F2E9" />
          <stop offset="1" stopColor="#EFE6D6" />
        </linearGradient>
        <linearGradient id={`${uid}-board`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#EFE6D6" />
          <stop offset="1" stopColor="#E4D8C2" />
        </linearGradient>
        {/* The jacket slides in from above and is clipped to the case, so it
            is never seen floating above the book. */}
        <clipPath id={`${uid}-case`}>
          <rect x="126" y="34" width="176" height="252" />
        </clipPath>
      </defs>

      <g style={carrier}>
        {/* ---- the surface ------------------------------------------------ */}
        {/* Identical in all six states. The object never leaves the bench. */}
        <ellipse cx="226" cy="303" rx="134" ry="16" fill={`url(#${uid}-shade)`} />

        {/* ---- loose sheets and a note ------------------------------------ */}
        <Layer
          show={loose}
          still={still}
          transform={loose ? 'rotate(-8deg)' : 'rotate(0deg)'}
        >
          <rect
            x="96"
            y="236"
            width="92"
            height="62"
            fill="#F7F2E9"
            stroke="#E4D8C2"
          />
          <path
            d="M108 254h58M108 264h64M108 274h44"
            stroke="#4A382E"
            strokeOpacity="0.3"
            strokeWidth="3"
          />
        </Layer>

        {looseSheets.map((leaf, i) => (
          <Layer
            key={i}
            show={loose}
            still={still}
            transform={
              loose
                ? `rotate(${leaf.rotate}deg) translate(${leaf.x}px, ${leaf.y}px)`
                : 'rotate(0deg) translate(0px, 0px)'
            }
          >
            <rect
              x="132"
              y="40"
              width="164"
              height="246"
              fill="#F7F2E9"
              stroke="#E4D8C2"
            />
          </Layer>
        ))}

        {/* ---- the text block --------------------------------------------- */}
        {/* Present at every stage. The pages never leave; everything else is
            built around them. */}
        <g>
          <path d="M296 40 318 55 318 301 296 286Z" fill="#EFE6D6" />
          <path d="M132 286 296 286 318 301 154 301Z" fill="#E4D8C2" />
          {edges.map((t, i) => (
            <path
              key={t}
              d={`M${296 + 22 * t} ${40 + 15 * t}V${286 + 15 * t}M${
                132 + 22 * t
              } ${286 + 15 * t}H${296 + 22 * t}`}
              stroke="#E4D8C2"
              strokeOpacity={i === 1 || i === 4 ? 0.55 : 1}
              strokeWidth="1"
            />
          ))}
          <path
            d="M132 40h164l22 15v246l-164 0-22-15Z"
            fill="none"
            stroke="#241812"
            strokeOpacity="0.18"
          />
        </g>

        {/* ---- the top sheet ---------------------------------------------- */}
        <Layer
          show={sheet}
          still={still}
          transform={loose ? 'rotate(-1.6deg)' : 'rotate(0deg)'}
        >
          <rect
            x="132"
            y="40"
            width="164"
            height="246"
            fill={`url(#${uid}-sheet)`}
            stroke="#E4D8C2"
          />
          <rect x="156" y="76" width="88" height="7" fill="#4A382E" />
          {typedLines.map(([y, w]) => (
            <rect
              key={y}
              x="156"
              y={y}
              width={w}
              height="3.4"
              fill="#4A382E"
              fillOpacity="0.42"
            />
          ))}
          {/* The rule pair a title page carries, struck once the pages are
              gathered into a manuscript. */}
          <Layer show={bound} still={still}>
            <path d="M156 60h116" stroke="#C9973F" />
            <path d="M156 64h116" stroke="#E4D8C2" />
          </Layer>
        </Layer>

        {/* ---- bound and clipped ------------------------------------------ */}
        <Layer show={bound} still={still}>
          {/* binding tape down the hinge */}
          <rect x="132" y="40" width="15" height="246" fill="#3E2A20" />
          <path d="M147 40v246" stroke="#C9973F" strokeOpacity="0.45" />
        </Layer>

        <Layer
          show={bound}
          still={still}
          transform={bound ? 'translateY(0px)' : 'translateY(-16px)'}
          delay={140}
        >
          {/* the clip, landing on the head of the squared block */}
          <path d="M184 28l-9-9M247 28l9-9" stroke="#2C1D15" strokeWidth="3.4" />
          <rect x="178" y="26" width="74" height="22" fill="#2C1D15" />
          <rect x="178" y="26" width="74" height="6" fill="#3E2A20" />
          <path d="M178 38h74" stroke="#C9973F" strokeOpacity="0.5" />
        </Layer>

        {/* ---- the case ---------------------------------------------------- */}
        {/* The boards close around the block, overhanging it at head, hinge and
            fore edge, the way the square of a hardback actually sits. */}
        <Layer
          show={cased}
          still={still}
          transform={cased ? 'scale(1)' : 'scale(0.965)'}
        >
          <path d="M302 34 309 39 309 291 302 286Z" fill="#E4D8C2" />
          <path d="M126 286 302 286 309 291 133 291Z" fill="#E4D8C2" />
          <path d="M126 286 302 286 309 291 133 291Z" fill="#241812" fillOpacity="0.1" />
          <rect
            x="126"
            y="34"
            width="176"
            height="252"
            fill={`url(#${uid}-board)`}
          />
          {/* Unprinted binder board is a shade heavier than the paper inside
              it, which keeps the blank case from reading as a lost sheet. */}
          <rect
            x="126"
            y="34"
            width="176"
            height="252"
            fill="#241812"
            fillOpacity="0.06"
          />
          <rect
            x="126"
            y="34"
            width="176"
            height="252"
            fill={`url(#${uid}-sheen)`}
          />
          {/* the joint, where the board hinges off the spine */}
          <path d="M143 34v252" stroke="#241812" strokeOpacity="0.18" />
          <path d="M146 34v252" stroke="#F7F2E9" strokeOpacity="0.55" />
          <path
            d="M126 34h176v252H126z"
            fill="none"
            stroke="#241812"
            strokeOpacity="0.22"
          />
        </Layer>

        {/* ---- the jacket -------------------------------------------------- */}
        <g clipPath={`url(#${uid}-case)`}>
          <Layer
            show={jacketed}
            still={still}
            transform={jacketed ? 'translateY(0px)' : 'translateY(-38px)'}
          >
            <rect x="126" y="34" width="176" height="252" fill="#1F4E5A" />
            {/* the turn over the spine and the fore edge */}
            <rect x="126" y="34" width="15" height="252" fill="#241812" fillOpacity="0.32" />
            <path d="M141.5 34v252" stroke="#F7F2E9" strokeOpacity="0.16" />
            <rect x="292" y="34" width="10" height="252" fill="#241812" fillOpacity="0.16" />
            <rect
              x="126"
              y="34"
              width="176"
              height="252"
              fill={`url(#${uid}-sheen)`}
            />
          </Layer>

          {/* The foil is stamped a beat after the jacket lands. */}
          <Layer
            show={jacketed}
            still={still}
            delay={200}
            transform={jacketed ? 'translateY(0px)' : 'translateY(-14px)'}
          >
            <rect
              x="140"
              y="48"
              width="148"
              height="224"
              fill="none"
              stroke="#C9973F"
              strokeWidth="1.4"
            />
            <rect
              x="146"
              y="54"
              width="136"
              height="212"
              fill="none"
              stroke="#C9973F"
              strokeWidth="0.6"
              strokeOpacity="0.65"
            />
            <rect x="160" y="122" width="108" height="11" fill="#F7F2E9" />
            <rect x="176" y="143" width="76" height="11" fill="#F7F2E9" />
            <path d="M188 174h52" stroke="#C9973F" />
            <rect
              x="182"
              y="196"
              width="64"
              height="6"
              fill="#E5BE72"
              fillOpacity="0.9"
            />
          </Layer>
        </g>

        {/* ---- the sticker -------------------------------------------------- */}
        {/* Applied late, because a sticker goes on after the book has settled. */}
        <Layer
          show={stickered}
          still={still}
          delay={300}
          transform={stickered ? 'scale(1)' : 'scale(0.5)'}
        >
          <circle cx="266" cy="76" r="27" fill="#E5BE72" />
          <circle
            cx="266"
            cy="76"
            r="27"
            fill="none"
            stroke="#C9973F"
            strokeWidth="1.8"
          />
          {/* The milled edge of the seal, so the roundel reads as struck foil
              and belongs to the same family as the brand mark. */}
          <circle
            cx="266"
            cy="76"
            r="21"
            fill="none"
            stroke="#3E2A20"
            strokeWidth="1.6"
            strokeOpacity="0.55"
            strokeLinecap="round"
            strokeDasharray="0.2 5"
          />
          <path
            d="M266 64l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"
            fill="#3E2A20"
          />
        </Layer>
      </g>

      {/* ---- the royalty chart -------------------------------------------- */}
      {/* Decorative. No numbers, no labels, no claim about what a book earns. */}
      <Layer
        show={charted}
        still={still}
        delay={160}
        transform={charted ? 'translateX(0px)' : 'translateX(18px)'}
      >
        <g aria-hidden="true">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={264 + i * 21}
              y={301 - h}
              width="13"
              height={h}
              fill="#3E2A20"
              fillOpacity={i > 3 ? 0.85 : 0.68}
            />
          ))}
          <path d="M256 301h156" stroke="#C9973F" strokeWidth="1.2" />
        </g>
      </Layer>
    </svg>
  )
}
