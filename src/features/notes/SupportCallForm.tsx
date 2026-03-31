import { useCallback, type ChangeEvent } from 'react'
import type { Note, SupportCallData } from '@shared/note-types'
import { useNoteStore } from '@/store/note-store'

type Props = { note: Note }

const field =
  'w-full rounded-md border border-white/10 bg-[#1a1d26] px-2.5 py-1.5 text-[13px] text-noto-text placeholder:text-noto-muted/45 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30'

export function SupportCallForm({ note }: Props) {
  const updateNote = useNoteStore((s) => s.updateNote)
  const data = note.supportCall
  if (!data) return null

  const patch = useCallback(
    (partial: Partial<SupportCallData>) => {
      updateNote(note.id, {
        supportCall: { ...data, ...partial }
      })
    },
    [data, note.id, updateNote]
  )

  const on =
    (key: keyof SupportCallData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      patch({ [key]: e.target.value })
    }

  return (
    <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#1a1d26] px-3 py-2.5">
      <div>
        <label className="mb-1 block text-[11px] font-medium text-noto-muted">Naam</label>
        <input
          className={field}
          type="text"
          autoComplete="name"
          placeholder="Contactpersoon"
          value={data.contactName}
          onChange={on('contactName')}
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-noto-muted">
          Bedrijfsnaam <span className="font-normal text-noto-muted/70">(optioneel)</span>
        </label>
        <input
          className={field}
          type="text"
          autoComplete="organization"
          placeholder="Bedrijf"
          value={data.companyName}
          onChange={on('companyName')}
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-noto-muted">Website</label>
        <input
          className={field}
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={data.website}
          onChange={on('website')}
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-noto-muted">Nummer</label>
        <input
          className={field}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Telefoonnummer"
          value={data.phone}
          onChange={on('phone')}
        />
      </div>
      <div className="flex min-h-[72px] flex-1 flex-col">
        <label className="mb-1 block text-[11px] font-medium text-noto-muted">
          Wat is er aan de hand?
        </label>
        <textarea
          className={`${field} min-h-[88px] flex-1 resize-none leading-relaxed`}
          placeholder="Korte omschrijving van het gesprek of het probleem…"
          spellCheck
          value={data.issue}
          onChange={on('issue')}
        />
      </div>
    </div>
  )
}
