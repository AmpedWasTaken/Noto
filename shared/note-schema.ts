import type { Note } from './note-types'

/** Bump when persisted shape changes (sync, migrations). */
export const NOTE_SCHEMA_VERSION = 1

export type PersistedNotesState = {
  schemaVersion: number
  notes: Note[]
}

export function parsePersistedNotes(raw: unknown): PersistedNotesState | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.schemaVersion !== 'number' || !Array.isArray(o.notes)) return null
  return { schemaVersion: o.schemaVersion, notes: o.notes as Note[] }
}
