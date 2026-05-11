/** IPC channel names shared between main and renderer (preload bridges invoke). */
export const IPC = {
  READY: 'noto:ready',
  SET_ALWAYS_ON_TOP: 'noto:set-always-on-top',
  GET_ALWAYS_ON_TOP: 'noto:get-always-on-top',
  SET_OVERLAY_VISIBLE: 'noto:set-overlay-visible',
  /** Main: `BrowserWindow#setIgnoreMouseEvents` — true = clicks pass through transparent areas. */
  SET_IGNORE_MOUSE_EVENTS: 'noto:set-ignore-mouse-events',
  LOAD_NOTES: 'noto:load-notes',
  SAVE_NOTES: 'noto:save-notes',
  CREATE_NOTE: 'noto:create-note',
  SCHEDULE_REMINDERS: 'noto:schedule-reminders',
  SNOOZE_REMINDER: 'noto:snooze-reminder',
  REGISTER_SHORTCUT: 'noto:register-shortcut',
  /** Directe vriendelijke melding (geen schema). */
  NUDGE_NOTE: 'noto:nudge-note'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]

/** `ipcMain.on` + `sendSync` only — blocks until written (quit / hide flush). */
export const IPC_SYNC = {
  SAVE_NOTES: 'noto:save-notes-sync'
} as const

/** Main → renderer one-way events (use preload subscriptions). */
export const IPC_EVENTS = {
  QUICK_ADD: 'noto:quick-add',
  REMINDER_DUE: 'noto:reminder-due',
  /** Main → renderer: direct opslaan (o.a. als overlay verborgen wordt). */
  FLUSH_SAVE: 'noto:flush-save',
  /** Gebruiker klikte op een systeemmelding → toon deze notitie. */
  OPEN_NOTE_FROM_NOTIFY: 'noto:open-note-from-notify'
} as const
