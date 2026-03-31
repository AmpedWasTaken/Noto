import { ipcMain, type BrowserWindow } from 'electron'
import { IPC } from '@shared/ipc-channels'

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle(IPC.READY, () => ({ ok: true as const }))

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
