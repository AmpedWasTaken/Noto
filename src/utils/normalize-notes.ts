import type { Note, NoteTask } from '@shared/note-types'

function asTasks(raw: unknown): NoteTask[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((t) => {
      if (!t || typeof t !== 'object') return null
      const o = t as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.text !== 'string' || typeof o.done !== 'boolean')
        return null
      return { id: o.id, text: o.text, done: o.done }
    })
    .filter((x): x is NoteTask => x !== null)
}

/** Ensures persisted notes from older saves include new fields. */
export function normalizeNote(n: Note): Note {
  return {
    ...n,
    tasks: asTasks((n as { tasks?: unknown }).tasks)
  }
}

export function normalizeNotes(notes: Note[]): Note[] {
  return notes.map(normalizeNote)
}
