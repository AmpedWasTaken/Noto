/// <reference types="vite/client" />

import type { IpcChannel } from '@shared/ipc-channels'

declare global {
  interface Window {
    noto: {
      ipc: Record<string, IpcChannel>
      invoke: (channel: IpcChannel, ...args: unknown[]) => Promise<unknown>
      onQuickAdd: (cb: () => void) => () => void
      onReminderDue: (
        cb: (payload: { noteId: string; repeat: 'none' | 'daily' }) => void
      ) => () => void
      onFlushSave: (cb: () => void) => () => void
    }
  }
}

export {}
