import { create } from 'zustand'
import type { Note } from '@shared/note-types'

function createId(): string {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function createDefaultNote(): Note {
  return {
    id: createId(),
    content: '',
    tasks: [],
    x: 48,
    y: 48,
    width: 320,
    height: 320,
    type: 'work',
    pinLevel: 'alwaysOnTop',
    miniMode: false,
    reminder: null
  }
}

type NoteStore = {
  notes: Note[]
  replaceNotes: (notes: Note[]) => void
  addNote: () => void
  updateNote: (id: string, patch: Partial<Note>) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  replaceNotes: (notes) => set({ notes }),
  addNote: () =>
    set((s) => ({
      notes: [...s.notes, createDefaultNote()]
    })),
  updateNote: (id, patch) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
    }))
}))
