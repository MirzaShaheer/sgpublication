/**
 * dataLayer push, guarded so nothing breaks when Google Tag Manager is absent.
 * GTM is not loaded on this site by default: the container id is read from
 * NEXT_PUBLIC_GTM_ID and the <GoogleTagManager> slot in the root layout is
 * commented out until the client supplies one.
 */

export type LeadSource = 'modal' | 'exit' | 'inline' | 'contact'

type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[]
}

export function pushEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as DataLayerWindow
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...payload })
  } catch {
    // A blocked or overwritten dataLayer must never break a form submission.
  }
}

export function trackLeadSubmit(source: LeadSource, stage?: string) {
  pushEvent('lead_submit', { lead_source: source, lead_stage: stage })
}
