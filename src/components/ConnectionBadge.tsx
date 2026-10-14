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
    ? 'bg-aqua-100 text-aqua-800 dark:bg-aqua-950 dark:text-aqua-300'
    : 'bg-crimson-100 text-crimson-800 dark:bg-crimson-950 dark:text-crimson-300'

  return (
    <div className="flex items-center gap-1.5" aria-live="polite">
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
        {online ? <Wifi className="size-3.5" aria-hidden="true" /> : <WifiOff className="size-3.5" aria-hidden="true" />}
        {online ? 'En línea' : 'Sin conexión'}
      </span>
      {pendientes > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-800 dark:bg-gold-950 dark:text-gold-300">
          <RefreshCw className="size-3.5" aria-hidden="true" />
          {pendientes} por sincronizar
        </span>
      )}
    </div>
  )
}
