import { create } from 'zustand'

/** Mirrors Electron always-on-top for calmer visuals while pinned. */
type OverlayChromeStore = {
  alwaysOnTop: boolean
  setAlwaysOnTop: (v: boolean) => void
}

export const useOverlayChromeStore = create<OverlayChromeStore>((set) => ({
  alwaysOnTop: false,
  setAlwaysOnTop: (alwaysOnTop) => set({ alwaysOnTop })
}))
