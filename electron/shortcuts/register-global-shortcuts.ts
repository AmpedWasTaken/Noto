import { app, globalShortcut, type BrowserWindow } from 'electron'
import { IPC_EVENTS } from '@shared/ipc-channels'

/** Ctrl+Shift+N quick-add; Ctrl+Shift+H hide/show overlay window. */
export function registerGlobalShortcuts(getWindow: () => BrowserWindow | null): void {
  const reg = (accelerator: string, fn: () => void) => {
    if (!globalShortcut.register(accelerator, fn)) {
      console.warn(`Noto: could not register global shortcut ${accelerator}`)
    }
  }

  reg('CommandOrControl+Shift+N', () => {
    const w = getWindow()
    if (w && !w.isDestroyed()) w.webContents.send(IPC_EVENTS.QUICK_ADD)
  })

  reg('CommandOrControl+Shift+H', () => {
    const w = getWindow()
    if (!w || w.isDestroyed()) return
    if (w.isVisible()) w.hide()
    else {
      w.show()
      w.focus()
    }
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
}
