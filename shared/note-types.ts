export type NoteType = 'work' | 'idea' | 'reminder'

/** Standaard notitie of supportgesprek met vaste velden. */
export type NoteCategory = 'note' | 'support'

export interface SupportCallData {
  contactName: string
  companyName: string
  website: string
  phone: string
  /** Korte omschrijving / wat er aan de hand is */
  issue: string
}

export type PinLevel = 'alwaysOnTop' | 'focusedOnTop' | 'behind'

export interface NoteReminder {
  at: string
  repeat: 'none' | 'daily'
  snoozedUntil?: string
}

export interface NoteTask {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  content: string
  /** Simple checklist rows (persisted with the note). */
  tasks: NoteTask[]
  category: NoteCategory
  /** Gevuld als `category === 'support'`. */
  supportCall: SupportCallData | null
  x: number
  y: number
  width: number
  height: number
  type: NoteType
  pinLevel: PinLevel
  /** Stapelvolgorde voor z-index (hoger = bovenop). */
  stackOrder: number
  /** Verborgen: geen kaart op het scherm; open weer via Overzicht. */
  hidden: boolean
  /** Legacy; altijd false na normalisatie. */
  miniMode: boolean
  /** Hoogte vóór inklappen; wordt hersteld bij uitklappen. */
  heightExpanded: number
  reminder: NoteReminder | null
}
