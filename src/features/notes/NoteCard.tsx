import { useCallback, type ChangeEvent } from 'react'
import type { Note } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'
import { noteAccentClass } from './note-theme'

type Props = {
  note: Note
}

export function NoteCard({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateNote(note.id, { content: e.target.value })
    },
    [note.id, updateNote]
  )

  return (
    <div
      className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-noto-surface/90 shadow-noto backdrop-blur-md ${noteAccentClass(note.type)} border-l-[3px]`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height
      }}
    >
      <header className="flex shrink-0 cursor-grab items-center justify-between border-b border-white/[0.06] px-3 py-2 active:cursor-grabbing">
        <span className="text-[11px] font-medium uppercase tracking-wider text-noto-muted">
          Noto
        </span>
        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-noto-muted">
          {note.type}
        </span>
      </header>
      <textarea
        className="min-h-0 flex-1 resize-none bg-transparent px-3 py-2 text-[13px] leading-relaxed text-noto-text placeholder:text-noto-muted/50 focus:outline-none"
        placeholder="Type something…"
        spellCheck
        value={note.content}
        onChange={onChange}
      />
    </div>
  )
}
