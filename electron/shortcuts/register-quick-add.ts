import { app, globalShortcut, type BrowserWindow } from 'electron'
import { IPC_EVENTS } from '@shared/ipc-channels'

/** Default: Ctrl+Shift+N (CommandOrControl includes macOS Command). */
export function registerQuickAddShortcut(getWindow: () => BrowserWindow | null): void {
  const accelerator = 'CommandOrControl+Shift+N'
  const ok = globalShortcut.register(accelerator, () => {
    const w = getWindow()
    if (w && !w.isDestroyed()) w.webContents.send(IPC_EVENTS.QUICK_ADD)
  })
  if (!ok) {
    console.warn(`Noto: could not register global shortcut ${accelerator}`)
  }
  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
}
