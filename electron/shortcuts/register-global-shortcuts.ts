import { app, globalShortcut, type BrowserWindow } from 'electron'
import { IPC_EVENTS } from '@shared/ipc-channels'

function sendQuickAdd(getWindow: () => BrowserWindow | null): void {
  const w = getWindow()
  if (!w || w.isDestroyed()) return
  if (!w.isVisible()) {
    w.show()
  }
  w.focus()
  w.webContents.send(IPC_EVENTS.QUICK_ADD)
}

/** Ctrl+Shift+N (of Cmd+Shift+N) nieuwe notitie; Ctrl+Alt+N als reserve. Overlay verborgen → weer tonen. */
export function registerGlobalShortcuts(getWindow: () => BrowserWindow | null): void {
  const reg = (accelerator: string, fn: () => void) => {
    if (!globalShortcut.register(accelerator, fn)) {
      console.warn(`Noto: could not register global shortcut ${accelerator}`)
    }
  }

  const quick = () => sendQuickAdd(getWindow)
  reg('CommandOrControl+Shift+N', quick)
  reg('CommandOrControl+Alt+N', quick)

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
