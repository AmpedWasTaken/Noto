import { useEffect, useState } from 'react'
import { IPC } from '@shared/ipc-channels'
import { OverlayControls } from '@/components/OverlayControls'
import { NoteCard } from '@/features/notes/NoteCard'
import { useNotesPersistence } from '@/hooks/use-notes-persistence'
import { useNoteStore } from '@/store/note-store'

export default function App() {
  const [ready, setReady] = useState(false)
  const hydrated = useNotesPersistence()
  const notes = useNoteStore((s) => s.notes)

  useEffect(() => {
    void window.noto.invoke(IPC.READY).then(() => setReady(true))
  }, [])

  useEffect(() => {
    const offQuick = window.noto.onQuickAdd(() => {
      useNoteStore.getState().addNote()
    })
    const offRem = window.noto.onReminderDue((payload) => {
      const { notes: list, updateNote } = useNoteStore.getState()
      const n = list.find((x) => x.id === payload.noteId)
      if (!n?.reminder) return
      if (payload.repeat === 'daily') {
        const base = new Date(n.reminder.snoozedUntil ?? n.reminder.at)
        const next = new Date(base.getTime() + 24 * 60 * 60 * 1000)
        updateNote(payload.noteId, {
          reminder: {
            ...n.reminder,
            at: next.toISOString(),
            snoozedUntil: undefined
          }
        })
      } else {
        updateNote(payload.noteId, { reminder: null })
      }
    })
    return () => {
      offQuick()
      offRem()
    }
  }, [])

  const showNotes = ready && hydrated

  return (
    <div className="pointer-events-none relative min-h-screen bg-transparent text-noto-text">
      {!showNotes ? (
        <div className="pointer-events-none p-6 text-sm text-noto-muted">Starting…</div>
      ) : (
        <>
          <OverlayControls />
          {notes.length === 0 ? (
            <div className="pointer-events-auto fixed left-1/2 top-24 z-[500] -translate-x-1/2 rounded-lg border border-white/10 bg-[#1e222c] px-4 py-3 text-center text-sm text-noto-muted shadow-noto">
              No notes — press{' '}
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-noto-text">
                Ctrl+Shift+N
              </kbd>{' '}
              to add one
            </div>
          ) : (
            notes.map((note) => <NoteCard key={note.id} note={note} />)
          )}
        </>
      )}
    </div>
  )
}
