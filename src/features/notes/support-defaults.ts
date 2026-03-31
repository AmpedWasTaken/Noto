import type { SupportCallData } from '@shared/note-types'

/** Vaste kaartgrootte: alles past in flex-layout zonder scroll op de buitenkant. */
export const SUPPORT_CARD = {
  width: 400,
  height: 480
} as const

export function emptySupportCall(): SupportCallData {
  return {
    contactName: '',
    companyName: '',
    website: '',
    phone: '',
    issue: ''
  }
}

export function centerSupportPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 48, y: 48 }
  const { width: cw, height: ch } = SUPPORT_CARD
  return {
    x: Math.max(12, Math.round((window.innerWidth - cw) / 2)),
    y: Math.max(12, Math.round((window.innerHeight - ch) / 2))
  }
}
