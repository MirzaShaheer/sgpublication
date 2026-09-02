'use client'

import { ExitIntent } from '@/components/lead/ExitIntent'
import { LeadModal } from '@/components/lead/LeadModal'
import { MobileLeadBar } from '@/components/lead/MobileLeadBar'
import { useLead } from '@/components/lead/LeadProvider'

/**
 * The three overlays, mounted once at the end of the layout.
 *
 * This file is only a switchboard. Which one may appear, and when, is decided
 * entirely by the provider, and each of them renders nothing at all until its
 * own flag is true, so an unopened overlay costs nothing on first paint.
 */
export function LeadOverlays() {
  const { overlay, close } = useLead()

  return (
    <>
      <LeadModal open={overlay === 'modal'} onClose={close} />
      <MobileLeadBar open={overlay === 'mobile'} onClose={close} />
      <ExitIntent open={overlay === 'exit'} onClose={close} />
    </>
  )
}
