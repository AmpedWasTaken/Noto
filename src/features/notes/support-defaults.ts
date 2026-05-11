import type { SupportCallData } from '@shared/note-types'

/** Vaste kaartgrootte: voldoende hoogte voor formulier + issue-veld. */
export const SUPPORT_CARD = {
  width: 420,
  height: 620
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
