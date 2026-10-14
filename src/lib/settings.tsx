import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { config } from '../data/mock'

export type Vendedor = { id: string; nombre: string; email: string; activo: boolean }

export type Empresa = {
  razonSocial: string
  nit: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
}

export type Settings = {
  negocio: string
  /** URL de datos de la imagen elegida; null = logotipo original de la marca. */
  logo: string | null
  empresa: Empresa
  umbralVencimientoDias: number
  stockMinimo: number
  vendedores: Vendedor[]
}

export type CamposGenerales = Pick<Settings, 'negocio' | 'logo' | 'empresa' | 'umbralVencimientoDias' | 'stockMinimo'>

/** Logotipo oficial de la marca (public/logo.jpg). */
export const LOGO_POR_DEFECTO = '/logo.jpg'

const KEY = 'chicha.settings.v1'

const empresaVacia: Empresa = { razonSocial: '', nit: '', telefono: '', email: '', direccion: '', ciudad: '' }

export const defaultSettings: Settings = {
  negocio: 'La Caribeña Bebidas',
  logo: null,
  empresa: empresaVacia,
  umbralVencimientoDias: config.umbralVencimientoDias,
  stockMinimo: config.stockMinimo,
  vendedores: [
    { id: 'v1', nombre: 'Carlos', email: 'carlos@ejemplo.com', activo: true },
    { id: 'v2', nombre: 'Andrea', email: 'andrea@ejemplo.com', activo: true },
    { id: 'v3', nombre: 'Luis', email: 'luis@ejemplo.com', activo: true },
  ],
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultSettings
    const p = JSON.parse(raw) as Partial<Settings> & { empresa?: Partial<Empresa> }
    const e = p.empresa ?? {}
    return {
      negocio: typeof p.negocio === 'string' && p.negocio.trim() ? p.negocio : defaultSettings.negocio,
      logo: typeof p.logo === 'string' && p.logo.startsWith('data:image/') ? p.logo : null,
      empresa: {
        razonSocial: str(e.razonSocial),
        nit: str(e.nit),
        telefono: str(e.telefono),
        email: str(e.email),
        direccion: str(e.direccion),
        ciudad: str(e.ciudad),
      },
      umbralVencimientoDias:
        typeof p.umbralVencimientoDias === 'number' ? p.umbralVencimientoDias : defaultSettings.umbralVencimientoDias,
      stockMinimo: typeof p.stockMinimo === 'number' ? p.stockMinimo : defaultSettings.stockMinimo,
      vendedores: Array.isArray(p.vendedores) ? p.vendedores : defaultSettings.vendedores,
    }
  } catch {
    return defaultSettings
  }
}

const newId = () => globalThis.crypto?.randomUUID?.() ?? `v${Date.now().toString(36)}`

type Ctx = {
  settings: Settings
  guardar: (campos: CamposGenerales) => void
  agregarVendedor: (nombre: string, email: string) => void
  alternarVendedor: (id: string) => void
  restablecer: () => void
}

const SettingsContext = createContext<Ctx | null>(null)

/**
 * Ajustes y personalización del negocio. Por ahora se guardan solo en este dispositivo
 * (localStorage). En la Fase 1 pasan a tablas de Supabase para compartirse entre dispositivos.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      // Sin almacenamiento disponible (o lleno): los ajustes viven solo en memoria.
    }
  }, [settings])

  const guardar = useCallback((campos: CamposGenerales) => {
    setSettings((s) => ({ ...s, ...campos }))
  }, [])

  const agregarVendedor = useCallback((nombre: string, email: string) => {
    setSettings((s) => ({
      ...s,
      vendedores: [...s.vendedores, { id: newId(), nombre, email, activo: true }],
    }))
  }, [])

  const alternarVendedor = useCallback((id: string) => {
    setSettings((s) => ({
      ...s,
      vendedores: s.vendedores.map((v) => (v.id === id ? { ...v, activo: !v.activo } : v)),
    }))
  }, [])

  const restablecer = useCallback(() => setSettings(defaultSettings), [])

  const value = useMemo(
    () => ({ settings, guardar, agregarVendedor, alternarVendedor, restablecer }),
    [settings, guardar, agregarVendedor, alternarVendedor, restablecer],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de <SettingsProvider>')
  return ctx
}
