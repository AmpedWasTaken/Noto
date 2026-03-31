import { useCallback, useEffect, useState } from 'react'
import { IPC } from '@shared/ipc-channels'

export function OverlayControls() {
  const [pinned, setPinned] = useState(true)

  useEffect(() => {
    void window.noto.invoke(IPC.GET_ALWAYS_ON_TOP).then((v) => {
      if (typeof v === 'boolean') setPinned(v)
    })
  }, [])

  const toggle = useCallback(() => {
    const next = !pinned
    setPinned(next)
    void window.noto.invoke(IPC.SET_ALWAYS_ON_TOP, next)
  }, [pinned])

  return (
    <div className="pointer-events-auto fixed right-4 top-4 z-[1000] flex items-center gap-2 rounded-lg border border-white/[0.1] bg-noto-surface/95 px-2 py-1.5 text-[11px] shadow-noto backdrop-blur-md">
      <span className="select-none text-noto-muted">Noto</span>
      <button
        type="button"
        onClick={toggle}
        className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
          pinned
            ? 'bg-emerald-500/25 text-emerald-200'
            : 'bg-white/[0.06] text-noto-muted hover:bg-white/[0.1]'
        }`}
        title={pinned ? 'Always on top (click to disable)' : 'Click to keep on top'}
      >
        {pinned ? 'On top' : 'Normal'}
      </button>
    </div>
  )
}
