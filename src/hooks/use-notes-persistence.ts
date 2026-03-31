import { useEffect, useState } from 'react'
import { IPC } from '@shared/ipc-channels'
import type { PersistedNotesState } from '@shared/note-schema'
import type { Note } from '@shared/note-types'
import { createDefaultNote, useNoteStore } from '@/store/note-store'
import { debounce } from '@/utils/debounce'
import { normalizeNotes } from '@/utils/normalize-notes'

const saveToDisk = debounce((notes: Note[]) => {
  void window.noto.invoke(IPC.SAVE_NOTES, notes)
}, 300)

/** Load notes on mount; debounced save when the store changes after hydration. */
export function useNotesPersistence(): boolean {
  const [hydrated, setHydrated] = useState(false)
  const replaceNotes = useNoteStore((s) => s.replaceNotes)

  useEffect(() => {
    void window.noto.invoke(IPC.LOAD_NOTES).then((raw) => {
      const data = raw as PersistedNotesState
      const list = data?.notes?.length ? normalizeNotes(data.notes) : [createDefaultNote()]
      replaceNotes(list)
      setHydrated(true)
    })
  }, [replaceNotes])

  useEffect(() => {
    if (!hydrated) return
    return useNoteStore.subscribe((state) => {
      saveToDisk(state.notes)
    })
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    return window.noto.onFlushSave(() => {
      void window.noto.invoke(IPC.SAVE_NOTES, useNoteStore.getState().notes)
    })
  }, [hydrated])

  return hydrated
}
