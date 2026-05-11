import { useEffect } from 'react'
import { IPC } from '@shared/ipc-channels'

const HIT = '[data-noto-interactive]'

/**
 * Full-screen transparent Electron windows still capture OS-level mouse hits.
 * Forward pointer moves to the renderer, hit-test for `data-noto-interactive`,
 * and toggle `setIgnoreMouseEvents` so empty areas click through to apps below.
 */
export function useOverlayPointerPassthrough(): void {
  useEffect(() => {
    if (typeof window.noto === 'undefined') return

    let lastIgnore: boolean | null = null
    const sync = (ignore: boolean) => {
      if (lastIgnore === ignore) return
      lastIgnore = ignore
      void window.noto.invoke(IPC.SET_IGNORE_MOUSE_EVENTS, ignore)
    }

    const updateFromEvent = (e: PointerEvent) => {
      if (e.buttons !== 0) {
        sync(false)
        return
      }
      const { clientX: x, clientY: y } = e
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        sync(true)
        return
      }
      const el = document.elementFromPoint(x, y)
      const hit = el?.closest(HIT)
      sync(!hit)
    }

    const onLeave = (e: PointerEvent) => {
      if (e.buttons === 0) sync(true)
    }

    sync(true)

    window.addEventListener('pointermove', updateFromEvent, { capture: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', updateFromEvent, { capture: true })
      document.documentElement.removeEventListener('pointerleave', onLeave)
      sync(false)
    }
  }, [])
}
