import type { NoteType } from '@/store/note-types'

const accents: Record<NoteType, string> = {
  work: 'border-l-emerald-400/80',
  idea: 'border-l-amber-400/80',
  reminder: 'border-l-sky-400/80'
}

export function noteAccentClass(type: NoteType): string {
  return accents[type]
}
