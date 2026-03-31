import { useCallback, useEffect, useRef, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { Note, NoteType } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'
import { NoteChecklist } from '@/features/notes/NoteChecklist'
import { ReminderBar } from '@/features/reminders/ReminderBar'
import { noteAccentClass } from './note-theme'

type Props = {
  note: Note
}

const MIN_W = 200
const MIN_H = 120
const SNAP = 14

type ResizeKind = 'se' | 's' | 'e'

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

export function NoteCard({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)
  const removeNote = useNoteStore((s) => s.removeNote)
  const dragRef = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)
  const resizeRef = useRef<{
    kind: ResizeKind
    startX: number
    startY: number
    origW: number
    origH: number
  } | null>(null)

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateNote(note.id, { content: e.target.value })
    },
    [note.id, updateNote]
  )

  const onTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateNote(note.id, { type: e.target.value as NoteType })
    },
    [note.id, updateNote]
  )

  const applySnap = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const maxX = Math.max(0, window.innerWidth - w)
      const maxY = Math.max(0, window.innerHeight - h)
      let nx = clamp(x, 0, maxX)
      let ny = clamp(y, 0, maxY)
      if (nx < SNAP) nx = 0
      if (ny < SNAP) ny = 0
      if (maxX - nx < SNAP) nx = maxX
      if (maxY - ny < SNAP) ny = maxY
      return { nx, ny }
    },
    []
  )

  useEffect(() => {
    const id = note.id
    const onMove = (e: PointerEvent) => {
      const n = useNoteStore.getState().notes.find((x) => x.id === id)
      if (!n) return
      if (dragRef.current) {
        const d = dragRef.current
        const dx = e.clientX - d.startX
        const dy = e.clientY - d.startY
        const nx = d.origX + dx
        const ny = d.origY + dy
        const { nx: sx, ny: sy } = applySnap(nx, ny, n.width, n.height)
        updateNote(id, { x: sx, y: sy })
      }
      if (resizeRef.current) {
        const r = resizeRef.current
        const dw = e.clientX - r.startX
        const dh = e.clientY - r.startY
        let w = n.width
        let h = n.height
        if (r.kind === 'e' || r.kind === 'se') {
          w = clamp(r.origW + dw, MIN_W, window.innerWidth - n.x)
        }
        if (r.kind === 's' || r.kind === 'se') {
          h = clamp(r.origH + dh, MIN_H, window.innerHeight - n.y)
        }
        updateNote(id, { width: w, height: h })
      }
    }
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null
        const n = useNoteStore.getState().notes.find((x) => x.id === id)
        if (n) {
          const { nx, ny } = applySnap(n.x, n.y, n.width, n.height)
          updateNote(id, { x: nx, y: ny })
        }
      }
      if (resizeRef.current) resizeRef.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [note.id, applySnap, updateNote])

  const onHeaderPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: note.x,
      origY: note.y
    }
  }

  const startResize = (kind: ResizeKind) => (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = {
      kind,
      startX: e.clientX,
      startY: e.clientY,
      origW: note.width,
      origH: note.height
    }
  }

  return (
    <div
      className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1e222c] shadow-noto transition-shadow duration-200 ease-out hover:shadow-lg ${noteAccentClass(note.type)} border-l-[3px]`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height
      }}
    >
      <header
        className="flex shrink-0 cursor-grab select-none items-center gap-2 border-b border-white/10 bg-[#232730] px-2 py-2 pl-3 active:cursor-grabbing"
        onPointerDown={onHeaderPointerDown}
      >
        <span className="min-w-0 flex-1 text-[11px] font-medium uppercase tracking-wider text-noto-muted">
          Noto
        </span>
        <select
          className="max-w-[88px] shrink-0 cursor-pointer rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-noto-text focus:outline-none"
          value={note.type}
          onChange={onTypeChange}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="work">Work</option>
          <option value="idea">Idea</option>
          <option value="reminder">Reminder</option>
        </select>
        <button
          type="button"
          title="Remove note"
          className="shrink-0 rounded px-2 py-0.5 text-[13px] leading-none text-noto-muted hover:bg-red-500/20 hover:text-red-200"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => removeNote(note.id)}
        >
          ×
        </button>
      </header>
      <textarea
        className="min-h-0 flex-1 resize-none bg-[#1a1d26] px-3 py-2 text-[13px] leading-relaxed text-noto-text placeholder:text-noto-muted/50 focus:outline-none"
        placeholder="Type something…"
        spellCheck
        value={note.content}
        onChange={onChange}
      />
      <NoteChecklist note={note} />
      <ReminderBar note={note} />
      {/* Bottom edge — change height */}
      <button
        type="button"
        aria-label="Resize height"
        className="absolute bottom-0 left-0 right-6 h-2 cursor-ns-resize touch-none bg-transparent"
        onPointerDown={startResize('s')}
      />
      {/* Right edge — change width */}
      <button
        type="button"
        aria-label="Resize width"
        className="absolute right-0 top-0 bottom-6 w-2 cursor-ew-resize touch-none bg-transparent"
        onPointerDown={startResize('e')}
      />
      {/* Corner — change width and height */}
      <button
        type="button"
        aria-label="Resize note"
        className="absolute bottom-0 right-0 flex h-6 w-6 cursor-nwse-resize touch-none items-end justify-end p-0.5"
        onPointerDown={startResize('se')}
      >
        <span
          className="pointer-events-none block h-3 w-3 rounded-br-md border-b-2 border-r-2 border-white/25"
          aria-hidden
        />
      </button>
    </div>
  )
}
