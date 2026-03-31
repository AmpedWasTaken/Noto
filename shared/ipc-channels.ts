/** IPC channel names shared between main and renderer (preload bridges invoke). */
export const IPC = {
  READY: 'noto:ready',
  SET_ALWAYS_ON_TOP: 'noto:set-always-on-top',
  GET_ALWAYS_ON_TOP: 'noto:get-always-on-top',
  LOAD_NOTES: 'noto:load-notes',
  SAVE_NOTES: 'noto:save-notes',
  CREATE_NOTE: 'noto:create-note',
  SCHEDULE_REMINDERS: 'noto:schedule-reminders',
  SNOOZE_REMINDER: 'noto:snooze-reminder',
  REGISTER_SHORTCUT: 'noto:register-shortcut'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]

/** Main → renderer one-way events (use preload subscriptions). */
export const IPC_EVENTS = {
  QUICK_ADD: 'noto:quick-add',
  REMINDER_DUE: 'noto:reminder-due'
} as const
