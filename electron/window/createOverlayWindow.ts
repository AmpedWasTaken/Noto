import { BrowserWindow, screen } from 'electron'
import { join } from 'node:path'
import type { PreloadPathFn } from './types'

export function createOverlayWindow(getPreloadPath: PreloadPathFn): BrowserWindow {
  const { x, y, width, height } = screen.getPrimaryDisplay().workArea

  const win = new BrowserWindow({
    x,
    y,
    width,
    height,
    title: 'Noto',
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    skipTaskbar: true,
    /** Let other apps come in front; use the “On top” control to pin when needed. */
    alwaysOnTop: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  win.setMenuBarVisibility(false)

  win.once('ready-to-show', () => {
    win.show()
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}
