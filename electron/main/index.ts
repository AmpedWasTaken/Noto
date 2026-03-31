import { app, BrowserWindow } from 'electron'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createOverlayWindow } from '../window/createOverlayWindow'
import { registerIpcHandlers } from './ipc-setup'
import { loadNotesState } from './notes-persistence'
import { setNotesForReminders, startReminderScheduler } from '../notifications/reminder-scheduler'
import { registerQuickAddShortcut } from '../shortcuts/register-quick-add'

const __dirname = dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null

const gotLock = app.requestSingleInstanceLock()

function preloadPath(): string {
  const dir = join(__dirname, '../preload')
  const mjs = join(dir, 'index.mjs')
  if (existsSync(mjs)) return mjs
  return join(dir, 'index.js')
}

function createWindow(): void {
  mainWindow = createOverlayWindow(preloadPath)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const w = mainWindow
    if (w && !w.isDestroyed()) {
      if (w.isMinimized()) w.restore()
      w.focus()
    }
  })

  app.whenReady().then(() => {
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.noto.app')
    }
    registerIpcHandlers(() => mainWindow)
    void loadNotesState().then((state) => setNotesForReminders(state.notes))
    startReminderScheduler(() => mainWindow)
    registerQuickAddShortcut(() => mainWindow)
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
