import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IPC, IPC_EVENTS } from '@shared/ipc-channels'

contextBridge.exposeInMainWorld('noto', {
  ipc: IPC,
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
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
  }
})
