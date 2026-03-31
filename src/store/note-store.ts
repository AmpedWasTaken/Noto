import { create } from 'zustand'
import type { Note } from './note-types'

function createId(): string {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

const defaultNote = (): Note => ({
  id: createId(),
  content: '',
  x: 48,
  y: 48,
  width: 320,
  height: 220,
  type: 'work',
  pinLevel: 'alwaysOnTop',
  miniMode: false,
  reminder: null
})

type NoteStore = {
  notes: Note[]
  addNote: () => void
  updateNote: (id: string, patch: Partial<Note>) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [defaultNote()],
  addNote: () =>
    set((s) => ({
      notes: [...s.notes, defaultNote()]
    })),
  updateNote: (id, patch) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
    }))
}))
