import { NavLink, Outlet } from 'react-router-dom'
import { Boxes, LayoutDashboard, Receipt, Settings, ShoppingCart, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ConnectionBadge from './ConnectionBadge'
import { useRole, type Role } from '../lib/role'
import { LOGO_POR_DEFECTO, useSettings } from '../lib/settings'

type Item = { to: string; label: string; icon: LucideIcon; adminOnly?: boolean; end?: boolean }

const items: Item[] = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/ventas', label: 'Ventas', icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Boxes },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/gastos', label: 'Gastos', icon: Receipt, adminOnly: true },
  { to: '/ajustes', label: 'Ajustes', icon: Settings, adminOnly: true },
]

function Brand({ grande = false }: { grande?: boolean }) {
  const { settings } = useSettings()
  return (
    <div className="flex items-center gap-3">
      <img
        src={settings.logo ?? LOGO_POR_DEFECTO}
        alt={`Logotipo de ${settings.negocio}`}
        className={`${grande ? 'size-14' : 'size-10'} shrink-0 rounded-xl bg-white object-contain ring-1 ring-slate-200 dark:ring-slate-700`}
      />
      <span className="line-clamp-2 max-w-36 text-sm font-semibold leading-tight">{settings.negocio}</span>
    </div>
  )
}

function RoleSwitch() {
  const { role, setRole } = useRole()
  const options: { value: Role; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'vendedor', label: 'Vendedor' },
  ]
  return (
    <div
      className="inline-flex rounded-full bg-slate-100 p-0.5 text-xs font-medium dark:bg-slate-800"
      role="group"
      aria-label="Vista de demostración"
      title="Vista de demostración (se reemplaza por el login real)"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setRole(o.value)}
          aria-pressed={role === o.value}
          className={`rounded-full px-3 py-1 transition-colors ${
            role === o.value
              ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Layout() {
  const { role } = useRole()
  const visible = items.filter((i) => !i.adminOnly || role === 'admin')

  return (
    <div className="min-h-dvh">
      {/* Franja con los colores de la marca */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-1 bg-linear-to-r from-aqua-500 via-brand-600 to-crimson-500"
      />

      {/* Menú lateral: tableta y computador */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 bg-white p-4 pt-6 md:flex dark:border-slate-800 dark:bg-slate-900">
        <Brand grande />
        <nav className="mt-8 flex flex-col gap-1" aria-label="Principal">
          {visible.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/85 px-4 py-2.5 pt-3 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-900/85">
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="hidden md:block" />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ConnectionBadge pendientes={0} />
            <RoleSwitch />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Barra inferior: celular */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95"
        aria-label="Principal"
      >
        {visible.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[11px] font-medium ${
                isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
