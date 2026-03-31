import { useCallback } from 'react'
import type { Note, NoteTask } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'

function taskId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
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
    <div className="shrink-0 border-t border-white/10 bg-[#181b23] px-2 py-2">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <span className="text-[10px] font-medium uppercase tracking-wide text-noto-muted">
          Checklist
        </span>
        <button
          type="button"
          onClick={add}
          className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-noto-text hover:bg-white/15"
        >
          + Add
        </button>
      </div>
      <ul className="max-h-36 space-y-1 overflow-y-auto pr-0.5">
        {note.tasks.length === 0 ? (
          <li className="px-1 text-[11px] text-noto-muted/80">No items yet.</li>
        ) : (
          note.tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-start gap-2 rounded-md px-1 py-0.5 hover:bg-white/[0.04]"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-white/20 bg-[#12141a] text-emerald-500 focus:ring-emerald-500/40"
              />
              <input
                type="text"
                value={t.text}
                placeholder="Task…"
                onChange={(e) => editText(t.id, e.target.value)}
                className={`min-w-0 flex-1 bg-transparent text-[12px] text-noto-text placeholder:text-noto-muted/50 focus:outline-none ${
                  t.done ? 'text-noto-muted line-through' : ''
                }`}
              />
              <button
                type="button"
                aria-label="Remove task"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded px-1 text-[10px] text-noto-muted hover:bg-white/10 hover:text-noto-text"
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
