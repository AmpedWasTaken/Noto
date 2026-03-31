import { useEffect, useState } from 'react'
import { IPC } from '@shared/ipc-channels'
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

  const showNotes = ready && hydrated

  return (
    <div className="relative min-h-screen bg-transparent text-noto-text">
      {!showNotes ? (
        <div className="pointer-events-none p-6 text-sm text-noto-muted">Starting…</div>
      ) : (
        notes.map((note) => <NoteCard key={note.id} note={note} />)
      )}
    </div>
  )
}
