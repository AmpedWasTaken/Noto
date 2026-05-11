/// <reference types="vite/client" />

import type { IpcChannel } from '@shared/ipc-channels'

declare global {
  interface Window {
    noto: {
      ipc: Record<string, IpcChannel>
      invoke: (channel: IpcChannel, ...args: unknown[]) => Promise<unknown>
      /** Synchronous disk write — use before window quits so debounced saves are not lost. */
      saveNotesSync: (notes: unknown) => void
      onQuickAdd: (cb: () => void) => () => void
      onReminderDue: (
        cb: (payload: { noteId: string; repeat: 'none' | 'daily' }) => void
      ) => () => void
      onFlushSave: (cb: () => void) => () => void
      onOpenNoteFromNotify: (cb: (payload: { noteId: string }) => void) => () => void
    }
  }
}

export {}
