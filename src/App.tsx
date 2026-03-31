import { useEffect, useState } from 'react'
import { IPC } from '@shared/ipc-channels'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void window.noto.invoke(IPC.READY).then(() => setReady(true))
  }, [])

  return (
    <div className="min-h-screen bg-transparent p-6 text-noto-text">
      <h1 className="text-xl font-semibold tracking-tight text-noto-text/90">Noto</h1>
      <p className="mt-1 text-sm text-noto-muted">
        {ready ? 'Connected.' : 'Starting…'}
      </p>
    </div>
  )
}
