'use client'

import { useEffect } from 'react'

/**
 * Press the page and drag it to scroll.
 *
 * Mounted once in the layout and renders nothing. The gesture is deliberately
 * narrow, because on a page that is mostly running copy a drag also means
 * "select this text", and the reader must never lose that:
 *
 *   - Mouse only. Touch and pen already drag to scroll, and a second
 *     implementation on top of the native one only fights it.
 *   - Six pixels of travel before a press becomes a drag, so a click is still
 *     a click and a careful word selection is still a word selection.
 *   - A sideways drag is handed back to the browser untouched. Selecting along
 *     a line is horizontal; scrolling is not. That is what keeps both.
 *   - Presses that belong to something else (a link, a button, a field, a
 *     summary, an open dialog) never start a drag at all.
 *
 * Release with speed and the page glides on and settles, the way a thumb
 * flicked down a block of paper carries. That part is switched off under
 * prefers-reduced-motion, where the page stops where it was let go.
 */

/** Pointer travel before a press becomes a drag rather than a click. */
const ENGAGE_PX = 6

/**
 * Which way the page goes.
 *
 *    1  the page follows the drag: pull down and you move down the page.
 *   -1  the hand tool convention, as in a map or a PDF reader: the content
 *       follows the pointer, so pulling down carries you back up the page.
 *
 * One value, so the whole feel can be reversed on this line alone.
 */
const DIRECTION = 1

/** Momentum. Velocity is carried as pixels per millisecond. */
const FRICTION = 0.93
const VELOCITY_FLOOR = 0.02
/** Velocity is per millisecond, so a frame is worth this many of them. */
const FRAME_MS = 16
/** Weight of the newest sample, so one stuttering frame cannot fling the page. */
const SMOOTHING = 0.75
/**
 * Velocity is only sampled while the pointer moves, so it does not decay on
 * its own. Anyone who drags, holds still, then lets go has stopped on purpose
 * and must not be flung: a release this long after the last movement counts as
 * stationary, whatever the last sample said.
 */
const STALE_MS = 90

/** A press on any of these belongs to the element, not to the page. */
const INTERACTIVE = [
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  'summary',
  'video',
  'audio',
  'iframe',
  'embed',
  'object',
  '[role="button"]',
  '[role="link"]',
  '[role="dialog"]',
  '[contenteditable]:not([contenteditable="false"])',
  '[data-no-drag-scroll]',
].join(',')

export function DragScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement

    let startX = 0
    let startY = 0
    let lastY = 0
    let lastAt = 0
    let velocity = 0
    let pressed = false
    let engaged = false
    /* A sideways drag: given back to the browser and not looked at again until
       the next press. */
    let abandoned = false
    let glide = 0
    let glideTarget = 0
    /* The click a drag ends with is not a click, and is swallowed once. */
    let swallowClick = false

    function endGlide() {
      if (glide) cancelAnimationFrame(glide)
      glide = 0
      root.classList.remove('is-drag-scrolling')
    }

    function glideStep() {
      velocity *= FRICTION
      if (Math.abs(velocity) < VELOCITY_FLOOR) {
        endGlide()
        return
      }
      /* The target is carried as a float and scrolled to absolutely, so a
         glide slower than one pixel per frame still moves the page instead of
         being rounded away to nothing. */
      glideTarget += DIRECTION * velocity * FRAME_MS
      window.scrollTo(0, glideTarget)
      /* More than a couple of pixels of disagreement means the page clamped:
         the top or the bottom is here, and the glide is over. */
      if (Math.abs(window.scrollY - glideTarget) > 2) {
        endGlide()
        return
      }
      glide = requestAnimationFrame(glideStep)
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

      /* Any press stops a glide, so the page is never still moving under a
         reader who has already taken hold of it again. */
      endGlide()

      /* An open dialog owns the pointer, its own backdrop included: the page
         behind it must not move. */
      if (document.querySelector('[role="dialog"]')) return
      if (root.scrollHeight <= root.clientHeight) return

      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE)) return

      pressed = true
      engaged = false
      abandoned = false
      velocity = 0
      startX = event.clientX
      startY = event.clientY
      lastY = event.clientY
      lastAt = event.timeStamp

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerCancel)
    }

    function onPointerMove(event: PointerEvent) {
      if (!pressed || abandoned) return

      if (!engaged) {
        const dx = event.clientX - startX
        const dy = event.clientY - startY
        if (Math.abs(dx) < ENGAGE_PX && Math.abs(dy) < ENGAGE_PX) return
        /* Sideways means the reader is selecting a line, so the page lets go
           of the gesture rather than stealing it halfway through. */
        if (Math.abs(dx) > Math.abs(dy)) {
          abandoned = true
          return
        }
        engaged = true
        /* The first few pixels may already have begun a selection. */
        window.getSelection()?.removeAllRanges()
        root.classList.add('is-drag-scrolling', 'is-dragging')
      }

      const dy = event.clientY - lastY
      const dt = Math.max(event.timeStamp - lastAt, 1)
      lastY = event.clientY
      lastAt = event.timeStamp
      velocity = SMOOTHING * (dy / dt) + (1 - SMOOTHING) * velocity

      window.scrollBy(0, DIRECTION * dy)
    }

    function detach() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      pressed = false
      root.classList.remove('is-dragging')
    }

    function onPointerUp(event: PointerEvent) {
      const wasEngaged = engaged
      /* Held still before letting go: the reader parked the page rather than
         throwing it. */
      if (event.timeStamp - lastAt > STALE_MS) velocity = 0
      detach()
      engaged = false

      if (!wasEngaged) {
        root.classList.remove('is-drag-scrolling')
        return
      }

      /* Cleared on the next frame, which is always after the click the browser
         dispatches for this release. */
      swallowClick = true
      requestAnimationFrame(() => {
        swallowClick = false
      })

      if (reduced.matches || Math.abs(velocity) < VELOCITY_FLOOR) {
        root.classList.remove('is-drag-scrolling')
        return
      }
      glideTarget = window.scrollY
      glide = requestAnimationFrame(glideStep)
    }

    function onPointerCancel() {
      detach()
      engaged = false
      root.classList.remove('is-drag-scrolling')
    }

    function onClickCapture(event: MouseEvent) {
      if (!swallowClick) return
      swallowClick = false
      event.stopPropagation()
      event.preventDefault()
    }

    /* Selection and native dragging are both suppressed at the source while a
       drag is live: user-select alone still leaves an image or a link
       draggable. */
    function onSuppress(event: Event) {
      if (engaged) event.preventDefault()
    }

    /* Any other way of moving the page wins outright. */
    function onOverride() {
      if (glide) endGlide()
    }

    function bind() {
      window.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('click', onClickCapture, true)
      document.addEventListener('selectstart', onSuppress)
      document.addEventListener('dragstart', onSuppress)
      window.addEventListener('wheel', onOverride, { passive: true })
      window.addEventListener('keydown', onOverride)
    }

    function unbind() {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('click', onClickCapture, true)
      document.removeEventListener('selectstart', onSuppress)
      document.removeEventListener('dragstart', onSuppress)
      window.removeEventListener('wheel', onOverride)
      window.removeEventListener('keydown', onOverride)
      detach()
      endGlide()
    }

    /* Plugging a mouse into a tablet, or lifting the tablet off its dock,
       turns the gesture on and off without a reload. */
    const sync = () => {
      unbind()
      if (finePointer.matches) bind()
    }

    sync()
    finePointer.addEventListener('change', sync)
    return () => {
      finePointer.removeEventListener('change', sync)
      unbind()
    }
  }, [])

  return null
}
