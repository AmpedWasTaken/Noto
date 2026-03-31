import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('noto', {})
