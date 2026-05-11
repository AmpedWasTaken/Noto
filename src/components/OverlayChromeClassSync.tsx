import { useEffect } from 'react'
import { useOverlayChromeStore } from '@/store/overlay-chrome-store'

const HTML_CLASS = 'noto-aot-dim'

/** Toggles global class when “On top” is active so CSS can soften chrome. */
export function OverlayChromeClassSync() {
  const pinned = useOverlayChromeStore((s) => s.alwaysOnTop)

  useEffect(() => {
    document.documentElement.classList.toggle(HTML_CLASS, pinned)
    return () => {
      document.documentElement.classList.remove(HTML_CLASS)
    }
  }, [pinned])

  return null
}
