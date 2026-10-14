import { useEffect, useState } from 'react'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

/** `pendientes` será el tamaño de la cola de sincronización offline (Fase 3). */
export default function ConnectionBadge({ pendientes = 0 }: { pendientes?: number }) {
  const online = useOnline()

  const style = online
    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'

  return (
    <div className="flex items-center gap-1.5" aria-live="polite">
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
        {online ? <Wifi className="size-3.5" aria-hidden="true" /> : <WifiOff className="size-3.5" aria-hidden="true" />}
        {online ? 'En línea' : 'Sin conexión'}
      </span>
      {pendientes > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <RefreshCw className="size-3.5" aria-hidden="true" />
          {pendientes} por sincronizar
        </span>
      )}
    </div>
  )
}
