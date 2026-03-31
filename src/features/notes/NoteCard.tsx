import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent
} from 'react'
import type { Note, NoteCategory } from '@shared/note-types'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { HeadsetIcon } from '@/components/icons/HeadsetIcon'
import { PencilIcon } from '@/components/icons/PencilIcon'
import { ReminderSection } from '@/features/reminders/ReminderSection'
import { NoteChecklist } from '@/features/notes/NoteChecklist'
import { SupportCallForm } from '@/features/notes/SupportCallForm'
import { emptySupportCall } from '@/features/notes/support-defaults'
import { useNoteStore } from '@/store/note-store'
import { fullViewportBounds } from '@/utils/viewport'

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

function categoryAccent(cat: NoteCategory): string {
  return cat === 'support'
    ? 'border-l-emerald-600/80'
    : 'border-l-slate-500/70'
}

export function NoteCard({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)
  const removeNote = useNoteStore((s) => s.removeNote)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!confirmDelete) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmDelete(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmDelete])

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

  const setCategory = useCallback(
    (cat: NoteCategory) => {
      if (cat === 'support') {
        const sc = note.supportCall ?? {
          ...emptySupportCall(),
          issue: note.content.trim() || ''
        }
        updateNote(note.id, {
          category: 'support',
          supportCall: sc,
          ...fullViewportBounds()
        })
      } else {
        const merged =
          note.content.trim() ||
          note.supportCall?.issue?.trim() ||
          note.supportCall?.contactName?.trim() ||
          ''
        updateNote(note.id, {
          category: 'note',
          supportCall: null,
          content: merged,
          x: 48,
          y: 48,
          width: 320,
          height: 320
        })
      }
    },
    [note.content, note.id, note.supportCall, updateNote]
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

  const cat = note.category ?? 'note'
  const isSupport = cat === 'support'

  const onHeaderPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    if (isSupport) return
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

  const handleDelete = useCallback(() => {
    removeNote(note.id)
    setConfirmDelete(false)
  }, [note.id, removeNote])

  useEffect(() => {
    if (!isSupport) return
    const fit = () => {
      updateNote(note.id, fullViewportBounds())
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [isSupport, note.id, updateNote])

  return (
    <div
      className={`pointer-events-auto absolute flex flex-col overflow-hidden border border-white/10 border-l-[3px] bg-[#1e222c] shadow-noto transition-shadow duration-200 ease-out hover:shadow-lg ${isSupport ? 'rounded-none' : 'rounded-xl'} ${categoryAccent(cat)}`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height
      }}
    >
      <header
        className={`flex shrink-0 select-none items-center gap-2 border-b border-white/10 bg-[#232730] px-2 py-2 ${isSupport ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        onPointerDown={onHeaderPointerDown}
      >
        <span
          className="flex shrink-0 items-center justify-center text-noto-muted"
          title={cat === 'support' ? 'Support' : 'Notitie'}
        >
          {cat === 'support' ? (
            <HeadsetIcon className="h-4 w-4 text-emerald-400/90" />
          ) : (
            <PencilIcon className="h-4 w-4" />
          )}
        </span>
        <span className="min-w-0 flex-1" />
        <button
          type="button"
          title="Remove note"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-lg leading-none text-noto-muted hover:bg-red-500/20 hover:text-red-200"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setConfirmDelete(true)}
        >
          ×
        </button>
      </header>

      <div className="flex shrink-0 gap-1 border-b border-white/10 bg-[#1e222c] px-2 py-1.5">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setCategory('note')}
          className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-colors ${
            cat === 'note'
              ? 'bg-white/12 text-noto-text'
              : 'text-noto-muted hover:bg-white/[0.06]'
          }`}
        >
          Notitie
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setCategory('support')}
          className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-colors ${
            cat === 'support'
              ? 'bg-emerald-500/20 text-emerald-100'
              : 'text-noto-muted hover:bg-white/[0.06]'
          }`}
        >
          Support
        </button>
      </div>

      {cat === 'support' && note.supportCall ? (
        <SupportCallForm note={note} />
      ) : (
        <textarea
          className="min-h-0 flex-1 resize-none bg-[#1a1d26] px-3 py-2 text-[13px] leading-relaxed text-noto-text placeholder:text-noto-muted/50 focus:outline-none"
          placeholder="Type something…"
          spellCheck
          value={note.content}
          onChange={onChange}
        />
      )}

      {cat === 'note' ? <NoteChecklist note={note} /> : null}
      {cat === 'note' ? <ReminderSection note={note} /> : null}

      {!isSupport ? (
        <>
          <button
            type="button"
            aria-label="Resize height"
            className="absolute bottom-0 left-0 right-6 h-2 cursor-ns-resize touch-none bg-transparent"
            onPointerDown={startResize('s')}
          />
          <button
            type="button"
            aria-label="Resize width"
            className="absolute right-0 top-0 bottom-6 w-2 cursor-ew-resize touch-none bg-transparent"
            onPointerDown={startResize('e')}
          />
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
        </>
      ) : null}

      <ConfirmDialog
        open={confirmDelete}
        title={cat === 'support' ? 'Support verwijderen?' : 'Notitie verwijderen?'}
        message={
          cat === 'support'
            ? 'Dit supportgesprek wordt gewist. Dit kun je niet ongedaan maken.'
            : 'Deze notitie wordt gewist. Dit kun je niet ongedaan maken.'
        }
        confirmLabel="Verwijderen"
        cancelLabel="Annuleren"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
