import { app } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  NOTE_SCHEMA_VERSION,
  parsePersistedNotes,
  type PersistedNotesState
} from '@shared/note-schema'

const FILE_NAME = 'noto-data.json'

function dataPath(): string {
  return join(app.getPath('userData'), FILE_NAME)
}

export async function loadNotesState(): Promise<PersistedNotesState> {
  try {
    const raw = await readFile(dataPath(), 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    const ok = parsePersistedNotes(parsed)
    if (ok) return ok
  } catch {
    /* missing or invalid file */
  }
  return { schemaVersion: NOTE_SCHEMA_VERSION, notes: [] }
}

export async function saveNotesState(state: PersistedNotesState): Promise<void> {
  const body = JSON.stringify(state, null, 2)
  await writeFile(dataPath(), body, 'utf-8')
}
