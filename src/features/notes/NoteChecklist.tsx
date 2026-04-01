import { useCallback } from 'react'
import type { Note, NoteTask } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'

function taskId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function CheckMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.2 6.4 11 12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type Props = { note: Note }

export function NoteChecklist({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)

  const setTasks = useCallback(
    (tasks: NoteTask[]) => {
      updateNote(note.id, { tasks })
    },
    [note.id, updateNote]
  )

  const toggle = useCallback(
    (taskId: string) => {
      setTasks(
        note.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
      )
    },
    [note.tasks, setTasks]
  )

  const editText = useCallback(
    (taskId: string, text: string) => {
      setTasks(note.tasks.map((t) => (t.id === taskId ? { ...t, text } : t)))
    },
    [note.tasks, setTasks]
  )

  const remove = useCallback(
    (taskId: string) => {
      setTasks(note.tasks.filter((t) => t.id !== taskId))
    },
    [note.tasks, setTasks]
  )

  const add = useCallback(() => {
    setTasks([...note.tasks, { id: taskId(), text: '', done: false }])
  }, [note.tasks, setTasks])

  return (
    <div className="shrink-0 border-t border-white/[0.08] bg-[#181b23]/90 px-2 py-2.5">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-noto-muted">
          Checklist
        </span>
        <button
          type="button"
          onClick={add}
          className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-noto-text transition-colors hover:border-white/18 hover:bg-white/[0.1]"
        >
          + Add
        </button>
      </div>
      <ul className="max-h-40 space-y-0.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {note.tasks.length === 0 ? (
          <li className="rounded-md px-2 py-2 text-[12px] text-noto-muted/85">
            Nog geen items — klik + Add.
          </li>
        ) : (
          note.tasks.map((t) => (
            <li
              key={t.id}
              className="group flex items-start gap-2.5 rounded-lg border border-transparent px-1.5 py-1.5 transition-colors hover:border-white/[0.06] hover:bg-white/[0.03]"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={t.done}
                title={t.done ? 'Markeer ongedaan' : 'Markeer af'}
                onClick={() => toggle(t.id)}
                className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181b23] ${
                  t.done
                    ? 'border-emerald-400/55 bg-emerald-500/15 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]'
                    : 'border-white/22 bg-[#12141a] text-transparent hover:border-white/35 hover:bg-[#161922]'
                }`}
              >
                {t.done ? <CheckMark className="h-3.5 w-3.5 text-emerald-200" /> : null}
              </button>
              <input
                type="text"
                value={t.text}
                placeholder="Taak…"
                onChange={(e) => editText(t.id, e.target.value)}
                className={`min-w-0 flex-1 border-b border-transparent bg-transparent py-0.5 text-[13px] leading-snug text-noto-text placeholder:text-noto-muted/45 focus:border-white/15 focus:outline-none ${
                  t.done ? 'text-noto-muted line-through decoration-white/20' : ''
                }`}
              />
              <button
                type="button"
                aria-label="Taak verwijderen"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-md px-1.5 py-0.5 text-[12px] text-noto-muted opacity-60 transition-opacity hover:bg-red-500/15 hover:text-red-200 group-hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
