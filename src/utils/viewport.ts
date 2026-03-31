/** Bounds die het hele overlay-venster vullen (geen randen). */
export function fullViewportBounds(): { x: number; y: number; width: number; height: number } {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, width: 1200, height: 800 }
  }
  return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
}
