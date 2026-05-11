import { create } from 'zustand'
import type { Note } from '@shared/note-types'
import {
  centerSupportPosition,
  emptySupportCall,
  SUPPORT_CARD
} from '@/features/notes/support-defaults'

const MIN_NOTE_H = 120

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
    stackOrder: 0,
    hidden: false,
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

function nextStackOrder(notes: Note[]): number {
  return notes.reduce((m, n) => Math.max(m, n.stackOrder ?? 0), 0) + 1
}

type NoteStore = {
  notes: Note[]
  replaceNotes: (notes: Note[]) => void
  addNote: () => void
  addSupportNote: () => void
  updateNote: (id: string, patch: Partial<Note>) => void
  removeNote: (id: string) => void
  /** Van overzicht: naar voren, uitklappen, in beeld. */
  openNoteFromOverview: (id: string) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  replaceNotes: (notes) => set({ notes }),
  addNote: () =>
    set((s) => {
      const next = nextStackOrder(s.notes)
      const n = createDefaultNote()
      return { notes: [...s.notes, { ...n, stackOrder: next }] }
    }),
  addSupportNote: () =>
    set((s) => {
      const next = nextStackOrder(s.notes)
      const n = createSupportNote()
      return { notes: [...s.notes, { ...n, stackOrder: next }] }
    }),
  updateNote: (id, patch) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
    })),
  removeNote: (id) =>
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id)
    })),
  openNoteFromOverview: (id) =>
    set((s) => {
      const n = s.notes.find((x) => x.id === id)
      if (!n) return s
      const stackOrder = nextStackOrder(s.notes)
      const expandedH = Math.max(MIN_NOTE_H, n.heightExpanded ?? n.height ?? MIN_NOTE_H)
      const w = n.width
      const maxX = Math.max(0, window.innerWidth - w)
      const maxY = Math.max(0, window.innerHeight - expandedH)
      const x = Math.min(Math.max(0, n.x), maxX)
      const y = Math.min(Math.max(0, n.y), maxY)
      return {
        notes: s.notes.map((note) =>
          note.id === id
            ? {
                ...note,
                stackOrder,
                hidden: false,
                miniMode: false,
                height: expandedH,
                x,
                y
              }
            : note
        )
      }
    })
}))
