import { ipcMain, type BrowserWindow } from 'electron'
import { IPC } from '@shared/ipc-channels'
import { NOTE_SCHEMA_VERSION } from '@shared/note-schema'
import type { Note } from '@shared/note-types'
import { loadNotesState, saveNotesState } from './notes-persistence'

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle(IPC.READY, () => ({ ok: true as const }))

  ipcMain.handle(IPC.LOAD_NOTES, () => loadNotesState())

  ipcMain.handle(IPC.SAVE_NOTES, (_e, notes: Note[]) => {
    const list = Array.isArray(notes) ? notes : []
    return saveNotesState({ schemaVersion: NOTE_SCHEMA_VERSION, notes: list }).then(() => ({
      ok: true as const
    }))
  })

  ipcMain.handle(IPC.SET_ALWAYS_ON_TOP, (_e, on: boolean) => {
    const win = getWindow()
    if (win) {
      win.setAlwaysOnTop(on)
      return { alwaysOnTop: on }
    }
    return { alwaysOnTop: false }
  })

  ipcMain.handle(IPC.GET_ALWAYS_ON_TOP, () => {
    const win = getWindow()
    return win ? win.isAlwaysOnTop() : false
  })
}
