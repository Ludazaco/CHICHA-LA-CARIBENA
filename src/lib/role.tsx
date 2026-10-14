import { createContext, useContext, useState, type ReactNode } from 'react'

export type Role = 'admin' | 'vendedor'

type RoleCtx = { role: Role; setRole: (r: Role) => void }

const Ctx = createContext<RoleCtx>({ role: 'admin', setRole: () => {} })

/**
 * Rol de demostración. Cuando conectemos Supabase Auth, el rol saldrá de la
 * tabla `perfiles` y este selector desaparecerá.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('admin')
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>
}

export const useRole = () => useContext(Ctx)
