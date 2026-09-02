# SG Publication

Marketing site for a full service book publishing house. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Prisma and Postgres, deployed to Railway.

---

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

**The site runs with no `DATABASE_URL` set.** That is a deliberate requirement, not an accident. With no database configured, `lib/db.ts` returns `null`, the `/api/lead` route logs the submitted payload to the console in development and still answers `{ ok: true }`, and every form on the site behaves normally. Nothing about local development requires Postgres.

Copy `.env.example` to `.env` if you want to change anything:

| Variable | Required | What it does |
| --- | --- | --- |
| `DATABASE_URL` | no | Postgres connection string. Leads are written to the `Lead` table when present, logged to the console when absent. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin used for absolute URLs in metadata, sitemap, structured data and OG images. Defaults to `https://sgpublication.com`. |
| `NEXT_PUBLIC_GTM_ID` | no | Google Tag Manager container id. The `<GoogleTagManager>` slot in `app/layout.tsx` is commented out until one is supplied. `lib/analytics.ts` pushes `lead_submit` events into `window.dataLayer` and is safe without GTM. |

### With a database

```bash
# set DATABASE_URL in .env first
npx prisma migrate dev --name init
```

`npm run build` runs `prisma generate` before `next build`. Generation needs the schema only, never a live connection, so the build succeeds with no database.

---

## Deploying to Railway

The repository carries a working `Dockerfile` and a `railway.json` that points at it.

1. Create a Railway project from this repository. `railway.json` selects the `DOCKERFILE` builder, so no Nixpacks configuration is needed.
2. Add the **Postgres** plugin. Railway injects `DATABASE_URL` automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin.
4. Run the migration once against the Railway database: `npx prisma migrate deploy` with `DATABASE_URL` pointed at it, either locally or as a one off Railway command.

The Dockerfile is a three stage build against Next's `standalone` output, so the runtime image carries the server bundle, the static assets and the Prisma engines and nothing else. `DATABASE_URL` is deliberately absent at build time: nothing in the build reads it, because the Prisma client is imported lazily inside the API route at runtime.

`PORT` and `HOSTNAME` are set in the image and Railway's injected `PORT` is respected.

**Nixpacks note.** Nixpacks also builds this project without changes, since `npm run build` and `npm start` are both standard. The Dockerfile is preferred because it produces a much smaller runtime image and pins the Node and OpenSSL versions Prisma needs.

## Deploying to Vercel

Also supported, and nothing needs configuring: **Root Directory** is the repository root, the build command is the default `npm run build`, and the framework preset is Next.js. `Dockerfile` and `railway.json` are ignored there.

The one thing that differs is `output`. `next.config.ts` asks for `standalone`, which is what the Dockerfile needs and what Vercel does not want, so the option is dropped when `VERCEL` is set in the build environment. Both paths are verified: a plain `next build` emits `.next/standalone`, and `VERCEL=1 next build` does not.

No environment variable is needed to build. `DATABASE_URL` is read only at request time by `/api/lead`, so a deployment without it serves every page and fails only on a form submission. Set `NEXT_PUBLIC_SITE_URL` to the live origin, or canonical URLs and the sitemap will point at the default in `lib/site.ts`.

**If the domain returns Vercel's `404: NOT_FOUND`,** the deployment is missing rather than broken, and it is worth checking in this order: that the Deployments tab shows a build for the latest commit on `main` at all; that the project's Production Branch is `main` and not `master`, since pushes to a non production branch only ever build previews; that Root Directory is the repository root and not `app`; and that the domain is attached to this project rather than an older one.

---

## Assumptions made during the build

These were judgement calls made rather than blocking on a question. Each is easy to reverse.

1. **The logo is the supplied artwork, in two copies.** The mark now ships as a file, so `components/brand/Seal.tsx` renders it through `next/image` and the earlier vector redraw is gone. Every seal on the site comes through that one component, at eight sizes between 34px and 92px, and next/image resizes and re-encodes the source per size and per device pixel ratio: the 38px masthead seal is served a 48px AVIF, not the 1080px original.

   **Why two files.** The artwork carries the wordmark curving across the foot of the disc. It reads at 200px and is a grey smear at 38px, so `public/logo-mark.png` is the same artwork with that band repainted out of the field, and `Seal` picks between the two at 128px. The band was not cropped away: the S and the G run out close to the rim, so any crop tight enough to lose the name also clips the monogram. Instead the rows the name occupied were repainted by interpolating the field from clean rows above and below, averaged across a 29px window so the field's grain did not smear into vertical streaks, with a little noise added back to match its tooth. If the artwork is ever replaced, regenerate both files together.

   **The favicons are the artwork, cropped and sharpened.** A straight downscale of the seal to 16px is a brown blur: the mark leaves padding inside the rim, so most of those sixteen pixels are field. `app/icon.png` (48), `icon1.png` (32) and `icon2.png` (16) are therefore cut from `logo-mark.png` at `extract({ left: 50, top: 10, width: 980, height: 980 })`, which crops to just inside the rim without clipping the S or the G, then resized with lanczos3 and sharpened at sigma 0.6. Three sizes rather than one, so the browser is handed a tuned 16px instead of downscaling a 48px itself. Regenerate all three the same way if the artwork changes.

   **The wordmark says "Selune Global Publication", the site says "SG Publication".** Both are right: Selune Global is the parent company and this is its book publishing division, with SG short for the parent. The site therefore says SG Publication throughout, the seal carries the full name at the sizes where it is legible, the hero closes on an imprint line naming the parent, and the `Organization` structured data carries it as `parentOrganization`. The name is set once, as `site.parent` in `lib/site.ts`.

2. **Two colour tokens were added to the briefed palette.** Brand gold `#C9973F` is 2.2:1 against the paper ground and brand olive `#7E8F52` is 3.2:1, so neither passes AA as text, and a `#C9973F` focus ring is below the 3:1 floor for a non text indicator. `--gold-ink` `#8A5F1E` (5.1:1) and `--olive-ink` `#55632F` (5.9:1) are the same hues darkened for legibility. Brand gold is still used exactly as briefed, as rules, borders and edges, and as ink on the bark field where it reaches 5.5:1. Nothing was replaced; two tokens were added beneath.

3. **No media strip was included at all.** The brief permitted three placeholder slots labelled honestly. Shipping none is safer: labelled placeholder slots tend to get filled with borrowed logos after handover, which is the exact anti pattern the brief rules out.

4. **All contact details, prices, team members, testimonials, books and case notes are placeholder.** Every one is marked in a code comment, and the prices are additionally marked in visible copy. Search the codebase for `PLACEHOLDER` before launch.

5. **The copyright year in the footer and the "last updated" dates on the legal pages are fixed constants,** not computed from the current date, so the build output is deterministic. Swap them for a computed year if a rolling date is preferred.

6. **The scheduling embed on `/contact` is a styled placeholder block,** with a code comment showing exactly where to paste the Calendly or SavvyCal iframe. No third party script is loaded, so nothing was added to the critical path or to the privacy surface without the client's decision.

7. **Next is pinned to 15.5.25 to keep `npm run build` working on Windows.** On 15.1.x the bundled `@vercel/og` resolved its own font by calling `path.join()` on a `file://` URL, which on Windows rewrites the forward slashes as backslashes and produces a string that is no longer a parseable URL, throwing `TypeError: Invalid URL` while prerendering `/apple-icon` and `/opengraph-image`. The build failed outright. Later versions use `new URL('./font', import.meta.url)` and are correct. Linux builds, including the Docker image, were never affected, but local development on Windows was.

---

## How the site is put together

### Design system

Everything visual is defined once in `app/globals.css`: the palette as Tailwind v4 `@theme` tokens, the type scale, the measure caps, and one easing curve. There is **no card primitive** in this codebase, deliberately. A book separates matter with rules, so sections separate with three rule classes, each with one job:

| Class | Job |
| --- | --- |
| `.rule-pair` | The section rule pair, the way a book rules above a running head. |
| `.rule-gold` | A 1px gold hairline, for emphasis and for the promoted package. |
| `.rule-quiet` | A 1px divider inside lists. |

Border radius across the site is 0 to 2px, the seal excepted.

Three type roles and no more: `font-display` (Newsreader) for headings and quotes, `font-sans` (Karla) for body, and `.marker`, a letterspaced small caps serif used only on package tier names, journey stage markers and footer column heads. There is no monospace anywhere.

Both families are self hosted through `next/font`, so there is no runtime request to Google and no flash of unstyled text.

### Motion

Three motion moments exist on the whole site, by design:

1. **The hero word rotator** (`components/home/RotatingHeadline.tsx`).
2. **The Author Journey reveal** (`components/home/AuthorJourney.tsx`).
3. **The drag to scroll glide** (`components/site/DragScroll.tsx`), described below.

No section has a fade and slide up entrance animation. All three freeze under `prefers-reduced-motion: reduce`, checked in JavaScript through `matchMedia` as well as in CSS.

### Drag to scroll

`components/site/DragScroll.tsx`, mounted once in the layout and rendering nothing. Press the page and pull it: drag down and the page goes down, drag up and it comes back. Release with speed and it glides on and settles; hold still before letting go and it stops dead where you left it.

On a page that is mostly running copy a drag also means "select this text", so the gesture is deliberately narrow and gives that back wherever it can:

| Rule | Why |
| --- | --- |
| Mouse only, via `(hover: hover) and (pointer: fine)` | Touch and pen already drag to scroll. A second implementation on top of the native one only fights it. |
| 6px of travel before a press becomes a drag | A click is still a click, and a careful word selection is still a word selection. |
| A sideways drag is handed straight back to the browser | Selecting along a line is horizontal, scrolling is not. This is what keeps both on the same page. |
| Links, buttons, fields, labels, `summary`, and anything inside an open dialog never start a drag | Those presses belong to the element. `data-no-drag-scroll` opts anything else out. |
| The glide is off under `prefers-reduced-motion: reduce` | The page stops where it was released instead of carrying. |

Two implementation notes. `html` carries `scroll-behavior: smooth`, which would animate every frame of a drag and leave the page lagging a long way behind the pointer, so `html.is-drag-scrolling` switches it off for the length of the gesture and its glide, and only then. And velocity is sampled only while the pointer moves, so it does not decay on its own: a release more than 90ms after the last movement counts as stationary, or dragging and then pausing before letting go would fling the page on stale numbers.

`DIRECTION` at the top of the file is the whole feel. `1` is the current behaviour, where the page follows the drag. `-1` is the hand tool convention, as in a map or a PDF reader, where the content follows the pointer and pulling down carries you back up.

### The hero rotator

The six rotating words live in `content/hero.ts` and are editable without touching the component. They are not arbitrary: each is an entry point a first time author actually arrives from, and each maps to one of the four stage options in the popup form, so a visitor sees themselves named in the first three seconds.

It causes **zero cumulative layout shift** because all six words are stacked in a CSS grid at `grid-area: 1 / 1`, with inactive words at `opacity: 0` and `pointer-events: none`. The container therefore always reserves the height of the line and the width of the longest word, and nothing is measured with JavaScript on mount. The first word is rendered in the server HTML, so there is no empty flash and crawlers see a complete sentence.

For screen readers the `h1` carries the complete static sentence and the animated element is `aria-hidden`. There is no `aria-live`, which would announce a new word every two seconds.

The interval pauses when the tab is hidden and when the hero leaves the viewport, and every timer is cleared on unmount.

### Content

There is no CMS. All content lives as typed data under `/content`:

```
content/hero.ts           the six rotating words and hero copy
content/journey.ts        the six stages, what SG does, what the AUTHOR does, timeframes
content/packages.ts       three tiers, add ons, the three guarantees   [PLACEHOLDER PRICING]
content/services.ts       the seven services
content/service-pages/    long form copy per service, 800+ words each
content/faqs.ts           fourteen questions across five categories
content/testimonials.ts   one long testimonial plus three more          [PLACEHOLDER]
content/books.ts          twelve portfolio titles                       [PLACEHOLDER]
content/team.ts           the about page team                           [PLACEHOLDER]
content/posts.ts          three blog posts
```

Editing copy means editing one of those files. No component holds prose that belongs in content.

### Lead capture

Four capture points coordinated by one `LeadProvider` so they never fire on top of each other, and so a visitor who has converted is never asked again.

| Point | Trigger | Ask |
| --- | --- | --- |
| Timed modal | 4s, desktop only, once per visitor | Two step: stage, then details |
| Mobile bar | 15s, under 768px only | The same two step form |
| Exit intent | `mouseleave` toward the top, desktop, once per session | Email only |
| Header button | Always present, masthead solid after 24px | Straight to the enquiry form |

**The modal never appears on mobile.** Google treats intrusive interstitials on mobile as a ranking negative when they appear on entry, so under 768px the bottom anchored slide up bar appears after 15 seconds instead. Same content, same form, no ranking penalty.

The modal is suppressed on `/contact` and while any element carrying `data-lead-form` is intersecting the viewport, so a visitor already looking at a form is never interrupted by another one.

State is stored as `sg_modal_seen` in `localStorage` expiring after 7 days, `sg_lead_converted` in `localStorage` permanently, and `sg_exit_seen` in `sessionStorage`. Every read and write is wrapped, so private mode and blocked storage degrade to in memory state rather than throwing.

**Testing the popup.** Those flags mean the prompt fires once per browser and then not again for a week, so it looks broken the second time you load the page. Two query parameters exist for that:

| URL | Effect |
| --- | --- |
| `/?lead=reset` | Clears all three flags. This browser is a first time visitor again, delay included. |
| `/?lead=now` | The same reset, and the 4 second wait is skipped so the modal opens on load. |

A backgrounded tab does not consume the capture point either: the countdown does not fire into a tab nobody is looking at, and `visibilitychange` picks it back up when the visitor returns.

The offer is a free 20 page publishing roadmap and a free 30 minute call, deliberately not a discount. Discount popups signal desperation and put SG in the same bucket as the low trust competitors it is trying to be distinguishable from.

Every successful submission pushes a `lead_submit` event with its source into `window.dataLayer`, guarded so it cannot break when GTM is absent.

### The API route

`POST /api/lead` validates with Zod, then writes to the `Lead` table through Prisma. Three deliberate behaviours:

- **No database, no problem.** Missing `DATABASE_URL` means the payload is logged and the route still answers `{ ok: true }`.
- **A failed write still answers `{ ok: true }`.** A lead that reached the server is never told it failed. The error is logged instead.
- **A filled honeypot answers `{ ok: true }` and writes nothing,** so a bot believes it succeeded.

There is a light in memory rate limit per IP. It is per instance only; a deployment running several instances wants a shared store.

### SEO

- Unique title and meta description per route through the App Router `metadata` export.
- JSON-LD: `Organization` sitewide with the logo, `Service` on each service page, `FAQPage` on the FAQ, `BreadcrumbList` sitewide.
- `app/sitemap.ts` and `app/robots.ts`.
- One `h1` per page, no skipped heading levels.
- Open Graph images generated with `next/og` from the seal and the page title.
- Every icon and card image is a file convention route, so there is no hardcoded path to drift:

  | Route | Size | Used for |
  | --- | --- | --- |
  | `app/icon.png`, `icon1`, `icon2` | 48, 32, 16 | The favicon, at three sizes so the browser picks one rather than downscaling a large one itself. |
  | `app/apple-icon.png` | 180x180 | iOS home screen. The artwork, wordmark removed. |
  | `app/opengraph-image.tsx` | 1200x630 | `og:image`. |
  | `app/twitter-image.tsx` | 1200x630 | `twitter:image`, re-exported from the Open Graph route so there is one card to maintain. |

  The Open Graph route inlines `public/logo-mark.png` as a data URI: satori resolves no relative URL and makes no network request, so the file is read from disk when the module loads, which holds in dev, in the build and in the container. The `Organization` logo in JSON-LD points at `/logo.png`, the full artwork, since Schema wants a square fetchable raster and nothing crops it there. Only the palette still lives in `components/brand/seal-marks.ts`, for the one route that renders outside the document.
- Service pages are built around real search intent (`book ghostwriting services`, `self publishing packages`, `book cover design services`, `audiobook production services`, `book marketing services`) and each carries more than 800 words of genuine explanatory content.

---

## Project structure

```
app/
  layout.tsx              fonts, metadata, LeadProvider, GTM slot
  page.tsx                the home page, sections 1 to 10
  globals.css             every design token, the rule primitives
  api/lead/route.ts       the single lead endpoint
  services/page.tsx       the services index: what each one includes, and a quote form
  services/[slug]/        seven service pages
  blog/[slug]/            three posts
  sitemap.ts robots.ts opengraph-image.tsx icon.svg
components/
  brand/                  Seal, BookObject, GeneratedCover
  ui/                     Container, Section, SectionHeading, Button, ServiceIcon
  site/                   Header, Footer, DragScroll
  home/                   the ten home page sections
  services/               ServiceBlocks, the long form block renderer
  lead/                   provider, modal, mobile bar, exit intent, forms, QuoteForm
  seo/                    JSON-LD components
content/                  all copy, as typed data
lib/                      site config, analytics, db, lead schema
prisma/schema.prisma      the Lead model
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server. Works with no database. |
| `npm run build` | `prisma generate` then `next build`. |
| `npm start` | Serves the production build. |
