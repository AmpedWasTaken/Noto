export type NoteType = 'work' | 'idea' | 'reminder'

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
  x: number
  y: number
  width: number
  height: number
  type: NoteType
  pinLevel: PinLevel
  miniMode: boolean
  reminder: NoteReminder | null
}
