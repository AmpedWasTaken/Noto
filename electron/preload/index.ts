import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IPC, IPC_EVENTS, IPC_SYNC } from '@shared/ipc-channels'

contextBridge.exposeInMainWorld('noto', {
  ipc: IPC,
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  saveNotesSync: (notes: unknown) => {
    ipcRenderer.sendSync(IPC_SYNC.SAVE_NOTES, notes)
  },
  onQuickAdd: (cb: () => void) => {
    const listener = () => cb()
    ipcRenderer.on(IPC_EVENTS.QUICK_ADD, listener)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.QUICK_ADD, listener)
    }
  },
  onReminderDue: (
    cb: (payload: { noteId: string; repeat: 'none' | 'daily' }) => void
  ) => {
    const listener = (_e: IpcRendererEvent, payload: unknown) => {
      cb(payload as { noteId: string; repeat: 'none' | 'daily' })
    }
    ipcRenderer.on(IPC_EVENTS.REMINDER_DUE, listener)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.REMINDER_DUE, listener)
    }
  },
  onFlushSave: (cb: () => void) => {
    const listener = () => cb()
    ipcRenderer.on(IPC_EVENTS.FLUSH_SAVE, listener)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.FLUSH_SAVE, listener)
    }
  },
  onOpenNoteFromNotify: (cb: (payload: { noteId: string }) => void) => {
    const listener = (_e: IpcRendererEvent, payload: unknown) => {
      const p = payload as { noteId?: string }
      if (typeof p?.noteId === 'string') cb({ noteId: p.noteId })
    }
    ipcRenderer.on(IPC_EVENTS.OPEN_NOTE_FROM_NOTIFY, listener)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.OPEN_NOTE_FROM_NOTIFY, listener)
    }
  }
})
