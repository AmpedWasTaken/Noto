import type { BrowserWindow, Notification } from 'electron'
import { IPC_EVENTS } from '@shared/ipc-channels'

/** Klik op de toast: venster tonen + renderer laat de juiste kaart zien. */
export function attachNotificationOpenNote(
  notification: Notification,
  getWindow: () => BrowserWindow | null,
  noteId: string
): void {
  notification.on('click', () => {
    const w = getWindow()
    if (!w || w.isDestroyed()) return
    if (!w.isVisible()) w.show()
    w.focus()
    w.webContents.send(IPC_EVENTS.OPEN_NOTE_FROM_NOTIFY, { noteId })
  })
}
