import { HeadsetIcon } from '@/components/icons/HeadsetIcon'
import { PencilIcon } from '@/components/icons/PencilIcon'
import { noteCardTitle } from '@/features/notes/note-title'
import { useNoteStore } from '@/store/note-store'

export function NotesOverviewList() {
  const notes = useNoteStore((s) => s.notes)
  const openNoteFromOverview = useNoteStore((s) => s.openNoteFromOverview)

  if (notes.length === 0) return null

  return (
    <nav
      data-noto-interactive
      aria-label="Alle notities"
      className="pointer-events-auto fixed left-3 top-14 z-[450] flex max-h-[min(78vh,30rem)] w-[min(16.5rem,calc(100vw-4rem))] min-w-[12.5rem] flex-col overflow-hidden rounded-lg border border-white/20 bg-[#282c36] text-[12px] leading-tight text-zinc-100 shadow-noto opacity-[0.58] transition-opacity duration-200 ease-out hover:opacity-100"
    >
      <div className="shrink-0 border-b border-white/15 bg-[#2f343e] px-2 py-1">
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-300">
          Overzicht
        </span>
      </div>
      <ul className="min-h-0 flex-1 space-y-px overflow-y-auto bg-[#282c36] px-1 py-1 [scrollbar-width:thin]">
        {notes.map((note) => {
          const title = noteCardTitle(note)
          const support = note.category === 'support'
          return (
            <li key={note.id}>
              <button
                type="button"
                title={note.hidden ? `${title} (verborgen)` : title}
                onClick={() => openNoteFromOverview(note.id)}
                className={`flex w-full items-start gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/12 ${
                  note.hidden ? 'text-zinc-400' : 'text-zinc-100'
                }`}
              >
                <span className="mt-px shrink-0 text-zinc-400" aria-hidden>
                  {support ? (
                    <HeadsetIcon className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <PencilIcon className="h-3.5 w-3.5 text-zinc-300" />
                  )}
                </span>
                <span
                  className={`min-w-0 flex-1 break-words font-medium [overflow-wrap:anywhere] leading-snug ${
                    note.hidden ? 'italic text-white/90' : 'text-white'
                  }`}
                >
                  {title}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
