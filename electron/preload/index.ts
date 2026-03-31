import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/ipc-channels'

contextBridge.exposeInMainWorld('noto', {
  ipc: IPC,
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args)
})
