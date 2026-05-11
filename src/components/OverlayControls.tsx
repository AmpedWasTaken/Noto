import { useCallback, useEffect } from 'react'
import { IPC } from '@shared/ipc-channels'
import { useNoteStore } from '@/store/note-store'
import { useOverlayChromeStore } from '@/store/overlay-chrome-store'

export function OverlayControls() {
  const addSupportNote = useNoteStore((s) => s.addSupportNote)
  const pinned = useOverlayChromeStore((s) => s.alwaysOnTop)
  const setPinned = useOverlayChromeStore((s) => s.setAlwaysOnTop)

  useEffect(() => {
    void window.noto.invoke(IPC.GET_ALWAYS_ON_TOP).then((v) => {
      if (typeof v === 'boolean') setPinned(v)
    })
  }, [setPinned])

  const toggle = useCallback(async () => {
    const next = !pinned
    const r = (await window.noto.invoke(IPC.SET_ALWAYS_ON_TOP, next)) as {
      alwaysOnTop?: boolean
    }
    setPinned(typeof r?.alwaysOnTop === 'boolean' ? r.alwaysOnTop : next)
  }, [pinned, setPinned])

  const hideOverlay = useCallback(() => {
    void window.noto.invoke(IPC.SET_OVERLAY_VISIBLE, false)
  }, [])

  return (
    <div
      data-noto-interactive
      className="noto-chrome-surface pointer-events-auto fixed right-4 top-4 z-[1000] flex max-w-[min(100vw-2rem,22rem)] flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#1e222c] px-2 py-1.5 text-[11px] shadow-noto"
    >
      <span className="select-none text-noto-muted">Noto</span>
      <button
        type="button"
        onClick={() => addSupportNote()}
        className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-200/95 hover:bg-emerald-500/25"
        title="Nieuw supportgesprek"
      >
        + Support
      </button>
      <button
        type="button"
        onClick={toggle}
        className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
          pinned
            ? 'bg-emerald-500/25 text-emerald-200'
            : 'bg-white/[0.06] text-noto-muted hover:bg-white/[0.1]'
        }`}
        title={
          pinned
            ? 'Boven andere vensters (klik voor normaal; rustiger uiterlijk tot je hovert)'
            : 'Venster boven andere apps houden'
        }
      >
        {pinned ? 'On top' : 'Normal'}
      </button>
      <button
        type="button"
        onClick={hideOverlay}
        className="rounded-md bg-white/[0.06] px-2 py-0.5 font-medium text-noto-muted hover:bg-white/[0.1]"
        title="Hide overlay (press Ctrl+Shift+H to show again)"
      >
        Hide
      </button>
    </div>
  )
}
