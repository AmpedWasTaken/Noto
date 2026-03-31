/// <reference types="vite/client" />

import type { IpcChannel } from '@shared/ipc-channels'

declare global {
  interface Window {
    noto: {
      ipc: Record<string, IpcChannel>
      invoke: (channel: IpcChannel, ...args: unknown[]) => Promise<unknown>
    }
  }
}

export {}
