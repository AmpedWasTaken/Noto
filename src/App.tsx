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
      offRem()
    }
  }, [])

  const showNotes = ready && hydrated

  return (
    <div className="relative min-h-screen bg-transparent text-noto-text">
      {!showNotes ? (
        <div className="pointer-events-none p-6 text-sm text-noto-muted">Starting…</div>
      ) : (
        <>
          <OverlayControls />
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </>
      )}
    </div>
  )
}
