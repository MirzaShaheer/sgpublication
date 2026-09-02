import type { ReactNode } from 'react'

/**
 * A book drawn as a physical object, not a flat rectangle with a drop shadow.
 *
 * Construction is a 2D three-quarter view, the way a print catalogue draws a
 * book: the spine sits on the left and is clipped shorter because it is the
 * farther plane, the front cover is clipped taller on its near edge, a hairline
 * stack of page edges shows along the head, and the shadow is an elliptical
 * smudge that touches the base of the object rather than a blurred copy
 * floating behind it.
 *
 * `children` is the cover artwork and fills the front face.
 */

type BookObjectProps = {
  children: ReactNode
  /** Width of the whole object in CSS length units. */
  width?: string
  /** Cover aspect ratio, height / width of the front face. 1.5 is trade. */
  ratio?: number
  /**
   * Let the content of the cover set the height instead of `ratio`.
   *
   * A trade paperback is drawn at a fixed proportion because nothing inside it
   * has an opinion. The hero jacket does: it carries the headline, and the
   * headline is three lines at one width and four at another, so the board has
   * to grow with what is printed on it rather than crop it.
   */
  autoHeight?: boolean
  /** Spine width as a fraction of the total width. */
  spine?: number
  /** Title shown on the spine, set vertically. */
  spineTitle?: string
  spineAuthor?: string
  /** Spine colour. Defaults to a darkened continuation of the cover. */
  spineColor?: string
  spineInk?: string
  /**
   * Size of the spine lettering. The default is right for a book drawn small
   * in a grid, where the spine is a few pixels wide and the name is texture
   * rather than something anyone reads. A book drawn large enough to have a
   * readable spine should pass a real size, the way the hero jacket does.
   */
  spineFontSize?: string
  className?: string
}

export function BookObject({
  children,
  width = '18rem',
  ratio = 1.5,
  autoHeight = false,
  spine = 0.11,
  spineTitle,
  spineAuthor,
  spineColor = '#2C1D15',
  spineInk = '#E5BE72',
  spineFontSize = 'clamp(0.42rem, 1.05vw, 0.6rem)',
  className,
}: BookObjectProps) {
  const spinePct = spine * 100
  const facePct = 100 - spinePct

  return (
    <div
      className={className}
      style={{ width, position: 'relative', isolation: 'isolate' }}
    >
      {/* head: the block of page edges, visible above the cover */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${spinePct + 1.5}%`,
          right: '1.5%',
          top: '-0.9%',
          height: '2.6%',
          background:
            'repeating-linear-gradient(to right, #EFE6D6 0 2px, #DCCDB2 2px 3px)',
          clipPath: 'polygon(0 42%, 100% 0, 100% 76%, 0 100%)',
          borderRadius: '1px',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          /* With autoHeight the cover below is in flow and sets this box's
             height; the spine is absolute either way and stretches to it. */
          aspectRatio: autoHeight ? undefined : `${1} / ${ratio}`,
        }}
      >
        {/* spine: the farther plane, so it is clipped shorter at both ends */}
        <div
          style={{
            position: 'absolute',
            inset: `0 ${facePct}% 0 0`,
            background: `linear-gradient(to right, ${spineColor} 0%, color-mix(in srgb, ${spineColor} 78%, #fff) 62%, color-mix(in srgb, ${spineColor} 55%, #000) 100%)`,
            clipPath: 'polygon(0 3.4%, 100% 1.4%, 100% 98.6%, 0 96.6%)',
          }}
        >
          {spineTitle ? (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  writingMode: 'vertical-rl',
                  fontFamily: 'var(--font-display)',
                  fontSize: spineFontSize,
                  /* Caps, the way a spine is set. Small caps rather than the
                     full ones so the name keeps the weight of the display
                     serif instead of turning into a row of capitals. */
                  fontVariantCaps: 'all-small-caps',
                  fontFeatureSettings: "'c2sc' 1, 'smcp' 1",
                  letterSpacing: '0.14em',
                  color: spineInk,
                  /* Foil, stamped: the die presses the letter into the cloth,
                     so it carries a shadow under it and a catch light above.
                     Both are a fraction of a pixel of colour; at spine sizes
                     that is the whole difference between ink printed on a
                     surface and ink lying on top of one. */
                  textShadow:
                    '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.07)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxHeight: '86%',
                  textOverflow: 'clip',
                }}
              >
                {spineTitle}
                {spineAuthor ? (
                  <span style={{ opacity: 0.72 }}>{`  ·  ${spineAuthor}`}</span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>

        {/* front cover: the nearer plane, clipped taller on its right edge.
            In flow when the content sets the height, absolute when the ratio
            does. The clip, the fill and the two light passes are the same in
            both cases: only what decides the height changes. */}
        <div
          style={{
            ...(autoHeight
              ? {
                  position: 'relative',
                  marginLeft: `${spinePct}%`,
                  width: `${facePct}%`,
                }
              : { position: 'absolute', inset: `0 0 0 ${spinePct}%` }),
            clipPath: 'polygon(0 1.4%, 100% 0, 100% 100%, 0 98.6%)',
            overflow: 'hidden',
            boxShadow: 'inset -1px 0 0 rgba(36,24,18,0.18)',
          }}
        >
          {children}
          {/* board gutter: the shallow crease beside the spine */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '0 auto 0 0',
              width: '5%',
              background:
                'linear-gradient(to right, rgba(36,24,18,0.34), rgba(36,24,18,0.02) 70%, transparent)',
              pointerEvents: 'none',
            }}
          />
          {/* the light that falls across a cover from the upper left */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(104deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 34%, rgba(36,24,18,0.09) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* contact shadow: an ellipse touching the base, densest under the spine */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-4%',
          right: '-7%',
          bottom: '-3.4%',
          height: '7%',
          background:
            'radial-gradient(ellipse 50% 50% at 42% 46%, rgba(36,24,18,0.40) 0%, rgba(36,24,18,0.16) 46%, rgba(36,24,18,0) 74%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
