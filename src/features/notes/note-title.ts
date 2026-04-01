import type { Note } from '@shared/note-types'

/** Eén regel voor ingeklapte kaart. */
export function noteCardTitle(note: Note): string {
  if (note.category === 'support' && note.supportCall) {
    const s = note.supportCall
    const t =
      s.contactName.trim() ||
      s.issue.trim().split('\n')[0]?.trim() ||
      s.companyName.trim() ||
      'Support'
    return t.length > 56 ? `${t.slice(0, 54)}…` : t
  }
  const line = note.content.split('\n')[0]?.trim() || ''
  if (!line) return 'Notitie'
  return line.length > 56 ? `${line.slice(0, 54)}…` : line
}
