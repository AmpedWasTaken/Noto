import { useEffect, useRef, useState } from 'react'
import { IPC } from '@shared/ipc-channels'
import type { PersistedNotesState } from '@shared/note-schema'
import type { Note } from '@shared/note-types'
import { createDefaultNote, useNoteStore } from '@/store/note-store'
import { normalizeNotes } from '@/utils/normalize-notes'

const SAVE_DEBOUNCE_MS = 250

/** Load notes on mount; debounced save when the store changes; sync flush on hide/quit. */
export function useNotesPersistence(): boolean {
  const [hydrated, setHydrated] = useState(false)
  const replaceNotes = useNoteStore((s) => s.replaceNotes)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const flushToDiskSync = () => {
    if (saveTimerRef.current !== undefined) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = undefined
    }
    window.noto.saveNotesSync(useNoteStore.getState().notes)
  }

  const scheduleSave = (notes: Note[]) => {
    if (saveTimerRef.current !== undefined) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = undefined
      void window.noto.invoke(IPC.SAVE_NOTES, notes)
    }, SAVE_DEBOUNCE_MS)
  }

  useEffect(() => {
    void window.noto.invoke(IPC.LOAD_NOTES).then((raw) => {
      const data = raw as PersistedNotesState | null
      const list =
        data && Array.isArray(data.notes)
          ? normalizeNotes(data.notes as Note[])
          : [createDefaultNote()]
      replaceNotes(list)
      setHydrated(true)
    })
  }, [replaceNotes])

  useEffect(() => {
    if (!hydrated) return
    return useNoteStore.subscribe((state) => {
      scheduleSave(state.notes)
    })
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    return window.noto.onFlushSave(() => {
      flushToDiskSync()
    })
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    const onLeave = () => {
      flushToDiskSync()
    }
    window.addEventListener('beforeunload', onLeave)
    window.addEventListener('pagehide', onLeave)
    return () => {
      window.removeEventListener('beforeunload', onLeave)
      window.removeEventListener('pagehide', onLeave)
    }
  }, [hydrated])

  return hydrated
}
