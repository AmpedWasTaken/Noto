import { Notification, ipcMain, type BrowserWindow } from 'electron'
import { IPC, IPC_SYNC } from '@shared/ipc-channels'
import { NOTE_SCHEMA_VERSION } from '@shared/note-schema'
import type { Note } from '@shared/note-types'
import { loadNotesState, saveNotesState, saveNotesStateSync } from './notes-persistence'
import { setNotesForReminders } from '../notifications/reminder-scheduler'
import { attachNotificationOpenNote } from '../notifications/attach-notification-open-note'
import { composeNudgeBody } from '@shared/nudge-messages'

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.on(IPC_SYNC.SAVE_NOTES, (_e, notes: unknown) => {
    const list = Array.isArray(notes) ? (notes as Note[]) : []
    setNotesForReminders(list)
    saveNotesStateSync({ schemaVersion: NOTE_SCHEMA_VERSION, notes: list })
  })

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

  ipcMain.handle(IPC.NUDGE_NOTE, (_e, preview: unknown, noteIdArg?: unknown) => {
    const previewStr = typeof preview === 'string' ? preview : ''
    const noteId = typeof noteIdArg === 'string' ? noteIdArg : `nudge-${Date.now()}`
    const body = composeNudgeBody(previewStr, noteId)
    if (Notification.isSupported()) {
      const n = new Notification({
        title: 'Noto — even checken',
        body,
        silent: false
      })
      attachNotificationOpenNote(n, getWindow, noteId)
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

  ipcMain.handle(IPC.SET_IGNORE_MOUSE_EVENTS, (_e, ignore: unknown) => {
    const win = getWindow()
    if (!win || win.isDestroyed()) return { ignore: false as const }
    const v = Boolean(ignore)
    win.setIgnoreMouseEvents(v, v ? { forward: true } : undefined)
    return { ignore: v }
  })
}
