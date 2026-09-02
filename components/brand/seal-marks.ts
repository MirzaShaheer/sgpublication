/**
 * The brand palette, as literals, for anything that renders outside the
 * document.
 *
 * app/opengraph-image.tsx runs through satori, which sees no stylesheet: it
 * cannot read the @theme tokens in globals.css, so the few colours it needs
 * are repeated here and must be changed with them.
 *
 * This file used to carry the seal as vector geometry as well, because the
 * image routes drew the mark themselves. None of them do now: the Open Graph
 * card inlines the artwork from public/logo-mark.png, and the Apple touch icon
 * and the three favicons are that same artwork resized. The mark is the
 * supplied file everywhere it appears.
 */
export const sealColors = {
  bark: '#3E2A20',
  gold: '#C9973F',
  goldLight: '#E5BE72',
  paper: '#F7F2E9',
} as const
