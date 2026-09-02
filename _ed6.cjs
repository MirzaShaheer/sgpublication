const fs = require('fs')
const swap = (p, from, to) => {
  const s = fs.readFileSync(p, 'utf8')
  if (!s.includes(from)) throw new Error('not found in ' + p)
  fs.writeFileSync(p, s.replace(from, to))
  console.log('patched', p)
}

swap('app/layout.tsx',
`  //   app/icon.svg             the favicon, the seal redrawn for 16px
  //   app/apple-icon.png       180x180, the artwork itself`,
`  //   app/icon.png             the favicon at 48, with icon1 32 and icon2 16
  //   app/apple-icon.png       180x180, the artwork itself`)

swap('components/brand/seal-marks.ts',
` * This file used to carry the seal as vector geometry as well, because the
 * image routes drew the mark themselves. They no longer do: the Open Graph
 * card inlines the artwork from public/logo-mark.png, and the Apple touch icon
 * is that same artwork as a static app/apple-icon.png. The one mark still
 * drawn by hand is the favicon, app/icon.svg, which holds its own paths.`,
` * This file used to carry the seal as vector geometry as well, because the
 * image routes drew the mark themselves. None of them do now: the Open Graph
 * card inlines the artwork from public/logo-mark.png, and the Apple touch icon
 * and the three favicons are that same artwork resized. The mark is the
 * supplied file everywhere it appears.`)

swap('components/brand/Seal.tsx',
` * This is the only place in the site where the seal appears. The favicon
 * (app/icon.svg) is drawn by hand instead, because at 16 device pixels the
 * photographic mark collapses into a brown blur.`,
` * This is the only place in the page where the seal appears. The favicons and
 * the Apple touch icon are the same artwork, resized ahead of time by the
 * script recorded in the README rather than served through here, because an
 * icon renders outside the document.`)

swap('README.md',
`  | \`app/icon.svg\` | 32 (scales) | The favicon. The seal reduced to the disc and the monogram, drawn as paths: at 16px the artwork itself is a blur, and a favicon renders outside the document, so it can reach neither the site fonts nor the CSS tokens. |`,
`  | \`app/icon.png\`, \`icon1\`, \`icon2\` | 48, 32, 16 | The favicon, at three sizes so the browser picks one rather than downscaling a large one itself. |`)

swap('README.md',
`   **The favicon is still drawn.** \`app/icon.svg\` keeps the hand drawn disc and monogram, because at 16 device pixels the artwork's bevels and drop shadow collapse into a brown blur while the drawn version still reads. To use the artwork there anyway, delete that file and add \`app/icon.png\`; look at it at 16px first.`,
`   **The favicons are the artwork, cropped and sharpened.** A straight downscale of the seal to 16px is a brown blur: the mark leaves padding inside the rim, so most of those 16 pixels are field. \`app/icon.png\` (48), \`icon1.png\` (32) and \`icon2.png\` (16) are therefore cut from \`logo-mark.png\` at \`extract({ left: 50, top: 10, width: 980, height: 980 })\`, which crops to just inside the rim without clipping the S or the G, then resized with lanczos3 and sharpened at sigma 0.6. Three sizes rather than one, so a browser is handed a tuned 16px instead of downscaling a 48px itself. Regenerate all three with the same recipe if the artwork changes.`)
