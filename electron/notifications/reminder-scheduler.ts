import { Notification, type BrowserWindow } from 'electron'
import type { Note } from '@shared/note-types'
import { IPC_EVENTS } from '@shared/ipc-channels'
import { composeNudgeBody, truncatePreview } from '@shared/nudge-messages'
import { loadNotesState } from '../main/notes-persistence'
import { attachNotificationOpenNote } from './attach-notification-open-note'

let notesRef: Note[] = []
const cooling = new Set<string>()

export function setNotesForReminders(next: Note[]): void {
  notesRef = next
}

let timer: ReturnType<typeof setInterval> | null = null

export function startReminderScheduler(getWindow: () => BrowserWindow | null): void {
  if (timer) return
  timer = setInterval(() => {
    void tick(getWindow)
  }, 45_000)
  void tick(getWindow)
}

async function tick(getWindow: () => BrowserWindow | null): Promise<void> {
  try {
    const state = await loadNotesState()
    notesRef = state.notes
  } catch {
    /* blijf laatste notesRef gebruiken */
  }

  const now = Date.now()
  for (const note of notesRef) {
    if (!note.reminder) continue
    const due = new Date(note.reminder.snoozedUntil ?? note.reminder.at).getTime()
    if (due > now) continue
    if (cooling.has(note.id)) continue
    cooling.add(note.id)
    setTimeout(() => cooling.delete(note.id), 5000)

    const previewRaw =
      note.supportCall?.issue?.trim() ||
      note.supportCall?.contactName?.trim() ||
      note.content.trim()
    const body = composeNudgeBody(truncatePreview(previewRaw), note.id)
    if (Notification.isSupported()) {
      const n = new Notification({
        title: 'Noto — herinnering',
        body,
        silent: false
      })
      attachNotificationOpenNote(n, getWindow, note.id)
      n.show()
    }

    const w = getWindow()
    if (w && !w.isDestroyed()) {
      w.webContents.send(IPC_EVENTS.REMINDER_DUE, {
        noteId: note.id,
        repeat: note.reminder.repeat
      })
    }
  }
}
