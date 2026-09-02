/**
 * Book cover artwork, composed in SVG from the brand palette and the site's
 * real typography. No grey placeholder boxes and no stock imagery.
 *
 * PLACEHOLDER: every title, author and cover in this site is invented sample
 * work. Replace with real jacket images before launch.
 *
 * Six layout archetypes, six palettes. A cover is assigned an archetype and a
 * palette deterministically from its slug, so the grid never renders the same
 * pairing twice in a row and the output is stable between server and client.
 */

export type CoverPalette = {
  bg: string
  ink: string
  accent: string
  /** Optional second ground, used by the archetypes that split the field. */
  bg2?: string
}

export const coverPalettes: CoverPalette[] = [
  { bg: '#3E2A20', ink: '#F7F2E9', accent: '#C9973F', bg2: '#2C1D15' },
  { bg: '#EFE6D6', ink: '#241812', accent: '#8A5F1E', bg2: '#E4D8C2' },
  { bg: '#1F4E5A', ink: '#F7F2E9', accent: '#E5BE72', bg2: '#15343D' },
  { bg: '#55632F', ink: '#F7F2E9', accent: '#E5BE72', bg2: '#414C23' },
  { bg: '#2C1D15', ink: '#EFE6D6', accent: '#C9973F', bg2: '#241812' },
  { bg: '#F7F2E9', ink: '#241812', accent: '#1F4E5A', bg2: '#EFE6D6' },
]

export const coverArchetypes = [
  'frame',
  'band',
  'initial',
  'stack',
  'arc',
  'ruled',
] as const

export type CoverArchetype = (typeof coverArchetypes)[number]

/** Stable small hash so archetype and palette are the same on both renders. */
function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0
  }
  return h
}

/** Greedy wrap that prefers even line lengths, deterministic and cheap. */
function wrap(text: string, maxChars: number, maxLines = 4): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  if (lines.length <= maxLines) return lines
  const kept = lines.slice(0, maxLines - 1)
  kept.push(lines.slice(maxLines - 1).join(' '))
  return kept
}

type GeneratedCoverProps = {
  title: string
  author: string
  /** Stable key used to pick the archetype and palette. */
  seed: string
  archetype?: CoverArchetype
  palette?: number
  className?: string
}

const W = 300
const H = 450

export function GeneratedCover({
  title,
  author,
  seed,
  archetype,
  palette,
  className,
}: GeneratedCoverProps) {
  const h = hash(seed)
  const arche = archetype ?? coverArchetypes[h % coverArchetypes.length]
  const pal = coverPalettes[palette ?? Math.floor(h / 7) % coverPalettes.length]

  const serif = 'var(--font-display)'
  const sans = 'var(--font-sans)'

  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${W} ${H}`,
    className,
    role: 'img' as const,
    'aria-label': `${title}, by ${author}`,
    preserveAspectRatio: 'none' as const,
  }

  const authorMark = (
    y: number,
    fill: string,
    anchor: 'start' | 'middle' | 'end' = 'middle',
    x = W / 2,
  ) => (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={sans}
      fontSize="11"
      letterSpacing="2.6"
      fill={fill}
      opacity="0.92"
    >
      {author.toUpperCase()}
    </text>
  )

  if (arche === 'frame') {
    const lines = wrap(title, 13)
    const size = lines.length > 2 ? 30 : 38
    const start = H / 2 - ((lines.length - 1) * size * 1.06) / 2 - 6
    return (
      <svg {...common}>
        <rect width={W} height={H} fill={pal.bg} />
        <rect
          x="20"
          y="20"
          width={W - 40}
          height={H - 40}
          fill="none"
          stroke={pal.accent}
          strokeWidth="1.4"
        />
        <rect
          x="26"
          y="26"
          width={W - 52}
          height={H - 52}
          fill="none"
          stroke={pal.accent}
          strokeWidth="0.6"
          opacity="0.7"
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x={W / 2}
            y={start + i * size * 1.06}
            textAnchor="middle"
            fontFamily={serif}
            fontSize={size}
            fill={pal.ink}
          >
            {line}
          </text>
        ))}
        <path
          d={`M${W / 2 - 26} ${start + lines.length * size * 1.06 + 12}h52`}
          stroke={pal.accent}
          strokeWidth="1"
        />
        {authorMark(H - 52, pal.accent)}
      </svg>
    )
  }

  if (arche === 'band') {
    const lines = wrap(title, 12, 3)
    const size = lines.length > 2 ? 28 : 34
    const bandTop = 96
    const bandHeight = lines.length * size * 1.12 + 44
    return (
      <svg {...common}>
        <rect width={W} height={H} fill={pal.bg} />
        <rect y={bandTop} width={W} height={bandHeight} fill={pal.bg2} />
        <path
          d={`M0 ${bandTop}h${W}M0 ${bandTop + bandHeight}h${W}`}
          stroke={pal.accent}
          strokeWidth="1.2"
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x="30"
            y={bandTop + 44 + i * size * 1.12}
            fontFamily={serif}
            fontSize={size}
            fill={pal.ink}
          >
            {line}
          </text>
        ))}
        <path
          d={`M30 ${H - 84}h44`}
          stroke={pal.accent}
          strokeWidth="1"
        />
        {authorMark(H - 60, pal.ink, 'start', 30)}
      </svg>
    )
  }

  if (arche === 'initial') {
    const lines = wrap(title, 15, 3)
    return (
      <svg {...common}>
        <rect width={W} height={H} fill={pal.bg} />
        <text
          x={W / 2}
          y="252"
          textAnchor="middle"
          fontFamily={serif}
          fontSize="220"
          fill={pal.accent}
          opacity="0.9"
        >
          {title.trim().charAt(0).toUpperCase()}
        </text>
        <path d={`M30 296h${W - 60}`} stroke={pal.accent} strokeWidth="1" />
        {lines.map((line, i) => (
          <text
            key={i}
            x="30"
            y={332 + i * 27}
            fontFamily={serif}
            fontSize="23"
            fill={pal.ink}
          >
            {line}
          </text>
        ))}
        {authorMark(H - 42, pal.accent, 'start', 30)}
      </svg>
    )
  }

  if (arche === 'stack') {
    const lines = wrap(title, 10, 4)
    const size = lines.length > 3 ? 32 : 40
    return (
      <svg {...common}>
        <rect width={W} height={H} fill={pal.bg} />
        <path d={`M40 56v${H - 130}`} stroke={pal.accent} strokeWidth="1.4" />
        {lines.map((line, i) => (
          <text
            key={i}
            x="58"
            y={130 + i * size * 1.08}
            fontFamily={serif}
            fontSize={size}
            fill={pal.ink}
          >
            {line}
          </text>
        ))}
        {authorMark(H - 56, pal.accent, 'start', 58)}
      </svg>
    )
  }

  if (arche === 'arc') {
    const lines = wrap(title, 14, 3)
    return (
      <svg {...common}>
        <rect width={W} height={H} fill={pal.bg} />
        <circle cx={W / 2} cy="150" r="96" fill={pal.accent} opacity="0.92" />
        <circle
          cx={W / 2}
          cy="150"
          r="106"
          fill="none"
          stroke={pal.accent}
          strokeWidth="0.8"
          opacity="0.55"
        />
        <path
          d={`M0 150h${W / 2 - 112}M${W / 2 + 112} 150h${W / 2 - 112}`}
          stroke={pal.accent}
          strokeWidth="0.8"
          opacity="0.55"
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x={W / 2}
            y={322 + i * 30}
            textAnchor="middle"
            fontFamily={serif}
            fontSize="26"
            fill={pal.ink}
          >
            {line}
          </text>
        ))}
        {authorMark(H - 46, pal.ink)}
      </svg>
    )
  }

  // 'ruled'
  const lines = wrap(title, 12, 3)
  const size = lines.length > 2 ? 30 : 36
  const start = 196
  return (
    <svg {...common}>
      <rect width={W} height={H} fill={pal.bg} />
      <path
        d={`M34 ${start - 46}h${W - 68}M34 ${start - 40}h${W - 68}`}
        stroke={pal.accent}
        strokeWidth="0.9"
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={W / 2}
          y={start + i * size * 1.1}
          textAnchor="middle"
          fontFamily={serif}
          fontSize={size}
          fill={pal.ink}
        >
          {line}
        </text>
      ))}
      <path
        d={`M34 ${start + lines.length * size * 1.1 + 16}h${W - 68}M34 ${
          start + lines.length * size * 1.1 + 22
        }h${W - 68}`}
        stroke={pal.accent}
        strokeWidth="0.9"
      />
      {authorMark(H - 54, pal.accent)}
    </svg>
  )
}
