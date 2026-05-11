/** Korte, vriendelijke variatie zodat meldingen niet robotachtig aanvoelen. */

function seedIndex(seed: string, mod: number): number {
  if (mod <= 0) return 0
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h % mod
}

const BODY_NO_PREVIEW = [
  'Ben je hier al klaar mee?',
  'Is dit al gedaan? Kleine check-in van Noto.',
  'Even opletten: was dit al af of nog open?',
  'Out of sight, out of mind? — Is dit nog iets om af te ronden?',
  'Korte herinnering: had je dit al afgewerkt?'
]

const BODY_WITH_PREVIEW = [
  (p: string) => `heb je dit al afgerond? — ${p}`,
  (p: string) => `Is dit al gedaan? — ${p}`,
  (p: string) => `Even checken: ${p} — klaar?`,
  (p: string) => `Vergeten? ${p} — nog actie nodig?`
]

const MAX_PREVIEW = 120

export function truncatePreview(text: string): string {
  const t = text.trim()
  if (t.length <= MAX_PREVIEW) return t
  return `${t.slice(0, MAX_PREVIEW - 1)}…`
}

/**
 * @param preview Snippet van notitie/support (mag leeg zijn)
 * @param seed Zorgt voor vaste keuze per notitie (bijv. noteId)
 */
export function composeNudgeBody(preview: string, seed: string): string {
  const p = truncatePreview(preview)
  if (!p) {
    return BODY_NO_PREVIEW[seedIndex(seed, BODY_NO_PREVIEW.length)] ?? BODY_NO_PREVIEW[0]!
  }
  const pick = BODY_WITH_PREVIEW[seedIndex(seed, BODY_WITH_PREVIEW.length)] ?? BODY_WITH_PREVIEW[0]!
  return pick(p)
}
