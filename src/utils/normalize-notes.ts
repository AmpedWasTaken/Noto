import type { Note, NoteTask, NoteCategory, SupportCallData } from '@shared/note-types'
import { emptySupportCall } from '@/features/notes/support-defaults'

const MIN_NOTE_HEIGHT = 120

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

function asCategory(raw: unknown): NoteCategory {
  return raw === 'support' ? 'support' : 'note'
}

function asSupportCall(raw: unknown): SupportCallData | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const base = emptySupportCall()
  return {
    contactName: typeof o.contactName === 'string' ? o.contactName : base.contactName,
    companyName: typeof o.companyName === 'string' ? o.companyName : base.companyName,
    website: typeof o.website === 'string' ? o.website : base.website,
    phone: typeof o.phone === 'string' ? o.phone : base.phone,
    issue: typeof o.issue === 'string' ? o.issue : base.issue
  }
}

/** Ensures persisted notes from older saves include new fields. */
export function normalizeNote(n: Note): Note {
  const loose = n as Note & { category?: unknown; supportCall?: unknown }
  const category = asCategory(loose.category)
  let supportCall: SupportCallData | null = asSupportCall(loose.supportCall)
  if (category === 'support' && !supportCall) {
    supportCall = emptySupportCall()
  }
  if (category === 'note') {
    supportCall = null
  }
  const looseN = n as Note & { miniMode?: unknown; heightExpanded?: unknown }
  const miniMode = typeof looseN.miniMode === 'boolean' ? looseN.miniMode : false
  const heightExpanded =
    typeof looseN.heightExpanded === 'number' && looseN.heightExpanded >= MIN_NOTE_HEIGHT
      ? looseN.heightExpanded
      : typeof n.height === 'number'
        ? n.height
        : 320

  return {
    ...n,
    tasks: asTasks((n as { tasks?: unknown }).tasks),
    category,
    supportCall,
    miniMode,
    heightExpanded
  }
}

export function normalizeNotes(notes: Note[]): Note[] {
  return notes.map(normalizeNote)
}
