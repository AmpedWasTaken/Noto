import { Notification, ipcMain, type BrowserWindow } from 'electron'
import { IPC } from '@shared/ipc-channels'
import { NOTE_SCHEMA_VERSION } from '@shared/note-schema'
import type { Note } from '@shared/note-types'
import { loadNotesState, saveNotesState } from './notes-persistence'
import { setNotesForReminders } from '../notifications/reminder-scheduler'

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle(IPC.READY, () => ({ ok: true as const }))

  ipcMain.handle(IPC.LOAD_NOTES, () => loadNotesState())

  ipcMain.handle(IPC.SAVE_NOTES, (_e, notes: Note[]) => {
    const list = Array.isArray(notes) ? notes : []
    setNotesForReminders(list)
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

  ipcMain.handle(IPC.NUDGE_NOTE, (_e, preview: string) => {
    const text =
      typeof preview === 'string' && preview.trim()
        ? `Ben je dit al afgerond? — ${preview.trim().slice(0, 120)}`
        : 'Ben je dit al afgerond?'
    if (Notification.isSupported()) {
      const n = new Notification({ title: 'Noto', body: text, silent: false })
      n.show()
    }
    return { ok: true as const }
  })

  ipcMain.handle(IPC.SET_OVERLAY_VISIBLE, (_e, visible: boolean) => {
    const win = getWindow()
    if (win && !win.isDestroyed()) {
      if (visible) {
        win.show()
        win.focus()
      } else {
        win.hide()
      }
      return { visible: win.isVisible() }
    }
    return { visible: false }
  })
}
