import defaultAssistants from '@global/resources/default-assistants.json'
import { Assistant, AssistantHistory } from '@global/types/assistant'
import { Config } from '@global/types/config'
import { DBType } from '@main/features/database/db.type'
import { app } from 'electron'
import fs from 'fs/promises'
import { JSONFilePreset } from 'lowdb/node'
import path from 'path'

/*
 * This file is responsible for initializing the database and handling
 * the IPC calls to the db services.
 * It uses lowdb to create a JSON file based database.
 * The database is stored in the user data directory of the app.
 */

const initialData: { assistants: Assistant[]; history: AssistantHistory[]; config: Config } = {
  assistants: defaultAssistants,
  history: [],
  config: {
    window: {
      width: 1024,
      height: 768
    },
    shortcut: '',
    runAtStartup: false
  }
}

let db: DBType

export async function initDB(): Promise<DBType> {
  const file = path.join(app.getPath('userData'), 'db.json')
  // for debug purposes, remove the db file if env var is set
  if (process.env.VITE_DEBUG_CLEANUP) {
    console.log('Removing database file for debug purposes')
    try {
      await fs.rm(file).then(() => console.log('Database file removed'))
    } catch (error) {
      console.error('Error removing database file:', error)
    }
  }

  db = await JSONFilePreset(file, initialData)
  await db.read()

  return db
}
