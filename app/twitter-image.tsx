/**
 * The Twitter and X card.
 *
 * Identical to the Open Graph card, re-exported rather than redrawn so there
 * is one image to maintain. Next needs the file to exist under this name to
 * emit the twitter:image tags; without it the card falls back to whatever the
 * crawler decides to pick off the page.
 */
export { default, alt, size, contentType } from './opengraph-image'
