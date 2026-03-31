import { useCallback, useEffect, useRef, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { Note, NoteType } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'
import { noteAccentClass } from './note-theme'

type Props = {
  note: Note
}

const MIN_W = 200
const MIN_H = 120
const SNAP = 14

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

export function NoteCard({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)
  const dragRef = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)
  const resizeRef = useRef<{
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
        const w = clamp(r.origW + dw, MIN_W, window.innerWidth - n.x)
        const h = clamp(r.origH + dh, MIN_H, window.innerHeight - n.y)
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

  const onResizePointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: note.width,
      origH: note.height
    }
  }

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
      <header
        className="flex shrink-0 cursor-grab select-none items-center justify-between border-b border-white/[0.06] px-3 py-2 active:cursor-grabbing"
        onPointerDown={onHeaderPointerDown}
      >
        <span className="text-[11px] font-medium uppercase tracking-wider text-noto-muted">
          Noto
        </span>
        <select
          className="max-w-[100px] cursor-pointer rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-noto-text focus:outline-none"
          value={note.type}
          onChange={onTypeChange}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="work">Work</option>
          <option value="idea">Idea</option>
          <option value="reminder">Reminder</option>
        </select>
      </header>
      <textarea
        className="min-h-0 flex-1 resize-none bg-transparent px-3 py-2 text-[13px] leading-relaxed text-noto-text placeholder:text-noto-muted/50 focus:outline-none"
        placeholder="Type something…"
        spellCheck
        value={note.content}
        onChange={onChange}
      />
      <button
        type="button"
        aria-label="Resize note"
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none"
        onPointerDown={onResizePointerDown}
      />
    </div>
  )
}
