import { create } from 'zustand'
import type { Note } from '@shared/note-types'
import {
  centerSupportPosition,
  emptySupportCall,
  SUPPORT_CARD
} from '@/features/notes/support-defaults'

function createId(): string {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function createDefaultNote(): Note {
  return {
    id: createId(),
    content: '',
    tasks: [],
    category: 'note',
    supportCall: null,
    x: 48,
    y: 48,
    width: 320,
    height: 320,
    type: 'work',
    pinLevel: 'alwaysOnTop',
    miniMode: false,
    heightExpanded: 320,
    reminder: null
  }
}

export function createSupportNote(): Note {
  const pos = centerSupportPosition()
  return {
    ...createDefaultNote(),
    category: 'support',
    supportCall: emptySupportCall(),
    x: pos.x,
    y: pos.y,
    width: SUPPORT_CARD.width,
    height: SUPPORT_CARD.height,
    heightExpanded: SUPPORT_CARD.height
  }
}

type NoteStore = {
  notes: Note[]
  replaceNotes: (notes: Note[]) => void
  addNote: () => void
  addSupportNote: () => void
  updateNote: (id: string, patch: Partial<Note>) => void
  removeNote: (id: string) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  replaceNotes: (notes) => set({ notes }),
  addNote: () =>
    set((s) => ({
      notes: [...s.notes, createDefaultNote()]
    })),
  addSupportNote: () =>
    set((s) => ({
      notes: [...s.notes, createSupportNote()]
    })),
  updateNote: (id, patch) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
    })),
  removeNote: (id) =>
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id)
    }))
}))
