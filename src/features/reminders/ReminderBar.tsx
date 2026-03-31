import { useCallback, useEffect, useState } from 'react'
import type { Note } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'

type Props = { note: Note }

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function ReminderBar({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)
  const [localTime, setLocalTime] = useState('')
  const [repeat, setRepeat] = useState<'none' | 'daily'>('none')

  useEffect(() => {
    if (note.reminder) {
      setLocalTime(toDatetimeLocalValue(note.reminder.snoozedUntil ?? note.reminder.at))
      setRepeat(note.reminder.repeat)
    } else {
      setLocalTime('')
      setRepeat('none')
    }
  }, [note.reminder])

  const applyReminder = useCallback(() => {
    if (!localTime) return
    const at = new Date(localTime).toISOString()
    updateNote(note.id, {
      reminder: { at, repeat, snoozedUntil: undefined }
    })
  }, [localTime, note.id, repeat, updateNote])

  const clearReminder = useCallback(() => {
    updateNote(note.id, { reminder: null })
  }, [note.id, updateNote])

  const snooze = useCallback(
    (minutes: number) => {
      if (!note.reminder) return
      const t = new Date()
      t.setMinutes(t.getMinutes() + minutes)
      updateNote(note.id, {
        reminder: { ...note.reminder, snoozedUntil: t.toISOString() }
      })
    },
    [note.id, note.reminder, updateNote]
  )

  return (
    <div className="shrink-0 space-y-2 border-t border-white/[0.06] px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="datetime-local"
          className="rounded-md border border-white/[0.08] bg-black/20 px-2 py-1 text-[11px] text-noto-text focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          value={localTime}
          onChange={(e) => setLocalTime(e.target.value)}
        />
        <select
          className="rounded-md border border-white/[0.08] bg-black/20 px-2 py-1 text-[11px] text-noto-text focus:outline-none"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as 'none' | 'daily')}
        >
          <option value="none">Once</option>
          <option value="daily">Daily</option>
        </select>
        <button
          type="button"
          className="rounded-md bg-emerald-500/25 px-2 py-1 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/35"
          onClick={applyReminder}
        >
          Set
        </button>
        {note.reminder ? (
          <button
            type="button"
            className="rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-noto-muted hover:bg-white/10"
            onClick={clearReminder}
          >
            Clear
          </button>
        ) : null}
      </div>
      {note.reminder ? (
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 text-[10px] text-noto-muted">Snooze</span>
          {[5, 15, 60].map((m) => (
            <button
              key={m}
              type="button"
              className="rounded bg-white/[0.06] px-2 py-0.5 text-[10px] text-noto-text hover:bg-white/10"
              onClick={() => snooze(m)}
            >
              {m === 60 ? '1h' : `${m}m`}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
