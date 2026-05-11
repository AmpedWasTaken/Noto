import { useCallback } from 'react'
import type { Note } from '@shared/note-types'
import { IPC } from '@shared/ipc-channels'
import { useNoteStore } from '@/store/note-store'

function previewForNudge(note: Note): string {
  if (note.category === 'support' && note.supportCall) {
    const s = note.supportCall
    return (
      s.issue.trim() ||
      s.contactName.trim() ||
      s.companyName.trim() ||
      'Support'
    )
  }
  return note.content.trim() || 'Notitie'
}

/** Geen datum/tijd-kiezer: direct seintje of over ~1 uur (scheduler). */
export function NudgeSection({ note }: { note: Note }) {
  const updateNote = useNoteStore((s) => s.updateNote)

  const nudgeNow = useCallback(() => {
    void window.noto.invoke(IPC.NUDGE_NOTE, previewForNudge(note), note.id)
  }, [note])

  const nudgeInOneHour = useCallback(() => {
    const at = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    updateNote(note.id, {
      reminder: { at, repeat: 'none', snoozedUntil: undefined }
    })
  }, [note.id, updateNote])

  const clearScheduled = useCallback(() => {
    updateNote(note.id, { reminder: null })
  }, [note.id, updateNote])

  return (
    <div className="shrink-0 space-y-2 border-t border-white/10 bg-[#181b23] px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-noto-muted">
        Seintje
      </p>
      <p className="text-[10px] leading-snug text-noto-muted/85">
        Systeemmeldingen werken ook als Noto verborgen is (Ctrl+Shift+H). Zo blijft het
        zichtbaar buiten je scherm. Klik op een melding om de kaart weer te openen.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-white/[0.08] px-2.5 py-1 text-[11px] text-noto-text hover:bg-white/[0.12]"
          onClick={nudgeNow}
        >
          Nu: “heb je dit al afgerond?”
        </button>
        <button
          type="button"
          className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/30"
          onClick={nudgeInOneHour}
        >
          Over 1 uur
        </button>
        {note.reminder ? (
          <button
            type="button"
            className="rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-noto-muted hover:bg-white/10"
            onClick={clearScheduled}
          >
            Gepland wissen
          </button>
        ) : null}
      </div>
    </div>
  )
}
