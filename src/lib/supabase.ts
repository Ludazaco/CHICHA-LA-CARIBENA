import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** true cuando las variables de entorno de Supabase están definidas. */
export const supabaseConfigured = Boolean(url && key)

/** Cliente de Supabase (null mientras no se configuren las variables). */
export const supabase = supabaseConfigured ? createClient(url!, key!) : null
