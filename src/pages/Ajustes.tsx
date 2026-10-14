import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Building2, Check, ImagePlus, Info, RotateCcw, ShieldCheck, Undo2, UserPlus } from 'lucide-react'
import { archivoALogo } from '../lib/logo'
import { LOGO_POR_DEFECTO, useSettings, type Empresa } from '../lib/settings'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-brand-900'

const primaryBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:bg-brand-800 sm:w-auto'

const secondaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'

type CampoEmpresa = {
  key: keyof Empresa
  label: string
  placeholder: string
  type?: 'text' | 'email' | 'tel'
  full?: boolean
}

const camposEmpresa: CampoEmpresa[] = [
  { key: 'razonSocial', label: 'Razón social', placeholder: 'Nombre legal de la empresa', full: true },
  { key: 'nit', label: 'NIT', placeholder: 'Ej.: 900.123.456-7' },
  { key: 'telefono', label: 'Teléfono / WhatsApp', placeholder: 'Ej.: 300 123 4567', type: 'tel' },
  { key: 'email', label: 'Correo de contacto', placeholder: 'contacto@tuempresa.com', type: 'email' },
  { key: 'ciudad', label: 'Ciudad', placeholder: 'Ciudad' },
  { key: 'direccion', label: 'Dirección', placeholder: 'Calle, número, barrio', full: true },
]

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  error?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-crimson-700 dark:text-crimson-400" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}

export default function Ajustes() {
  const { settings, guardar, agregarVendedor, alternarVendedor, restablecer } = useSettings()

  // --- Borradores del formulario principal (se aplican con "Guardar cambios") ---
  const [negocio, setNegocio] = useState(settings.negocio)
  const [logo, setLogo] = useState<string | null>(settings.logo)
  const [empresa, setEmpresa] = useState<Empresa>(settings.empresa)
  const [umbral, setUmbral] = useState(String(settings.umbralVencimientoDias))
  const [stock, setStock] = useState(String(settings.stockMinimo))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [logoError, setLogoError] = useState('')
  const [guardado, setGuardado] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Si los ajustes cambian desde fuera (p. ej. al restablecer), se sincroniza el formulario.
  useEffect(() => {
    setNegocio(settings.negocio)
    setLogo(settings.logo)
    setEmpresa(settings.empresa)
    setUmbral(String(settings.umbralVencimientoDias))
    setStock(String(settings.stockMinimo))
    setErrores({})
    setLogoError('')
  }, [settings.negocio, settings.logo, settings.empresa, settings.umbralVencimientoDias, settings.stockMinimo])

  async function onElegirLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setLogo(await archivoALogo(file))
      setLogoError('')
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'No se pudo cargar la imagen.')
    }
  }

  function onGuardar(e: FormEvent) {
    e.preventDefault()
    const err: Record<string, string> = {}

    const nombre = negocio.trim()
    if (!nombre) err.negocio = 'Escribe el nombre del negocio.'

    const correo = empresa.email.trim()
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) err.email = 'Escribe un correo válido.'

    const tel = empresa.telefono.trim()
    if (tel && tel.replace(/\D/g, '').length < 7) err.telefono = 'El teléfono debe tener al menos 7 dígitos.'

    const u = Number(umbral)
    if (umbral.trim() === '' || !Number.isInteger(u) || u < 1 || u > 365)
      err.umbral = 'Ingresa un número entero entre 1 y 365.'

    const s = Number(stock)
    if (stock.trim() === '' || !Number.isInteger(s) || s < 0) err.stock = 'Ingresa un número entero de 0 o más.'

    setErrores(err)
    if (Object.keys(err).length > 0) return

    guardar({
      negocio: nombre,
      logo,
      empresa: {
        razonSocial: empresa.razonSocial.trim(),
        nit: empresa.nit.trim(),
        telefono: tel,
        email: correo,
        direccion: empresa.direccion.trim(),
        ciudad: empresa.ciudad.trim(),
      },
      umbralVencimientoDias: u,
      stockMinimo: s,
    })
    setGuardado(true)
    window.setTimeout(() => setGuardado(false), 2500)
  }

  // --- Vendedores (cambios inmediatos) ---
  const [vNombre, setVNombre] = useState('')
  const [vEmail, setVEmail] = useState('')
  const [vError, setVError] = useState('')

  function onAgregar(e: FormEvent) {
    e.preventDefault()
    const nombre = vNombre.trim()
    const email = vEmail.trim().toLowerCase()

    if (!nombre) return setVError('Escribe el nombre del vendedor.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setVError('Escribe un correo válido.')
    if (settings.vendedores.some((v) => v.email.toLowerCase() === email))
      return setVError('Ese correo ya está registrado.')

    agregarVendedor(nombre, email)
    setVNombre('')
    setVEmail('')
    setVError('')
  }

  function onRestablecer() {
    if (
      window.confirm(
        '¿Restablecer los ajustes a los valores de ejemplo? Se perderán nombre, logotipo y datos de la empresa guardados en este dispositivo.',
      )
    ) {
      restablecer()
    }
  }

  const activos = settings.vendedores.filter((v) => v.activo).length

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personalización del negocio, alertas y vendedores.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 p-3 text-sm text-gold-900 dark:border-gold-900 dark:bg-gold-950/40 dark:text-gold-200">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <strong>Modo demostración.</strong> Por ahora los cambios se guardan solo en este dispositivo. Con Supabase
          (Fase 1) se compartirán entre todos los dispositivos y el acceso de cada vendedor será real.
        </p>
      </div>

      <form onSubmit={onGuardar} noValidate className="space-y-5">
        {/* Identidad */}
        <section className="card space-y-5">
          <h2 className="card-title">Identidad del negocio</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={logo ?? LOGO_POR_DEFECTO}
              alt="Logotipo actual"
              className="size-24 shrink-0 rounded-2xl bg-white object-contain ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">Logotipo</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                PNG, JPG, WebP o SVG. Se ve en el menú y en el encabezado de la app.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={onElegirLogo}
                  tabIndex={-1}
                  aria-label="Elegir archivo de logotipo"
                />
                <button type="button" className={secondaryBtn} onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="size-4" aria-hidden="true" />
                  Cambiar logotipo
                </button>
                {logo !== null && (
                  <button type="button" className={secondaryBtn} onClick={() => setLogo(null)}>
                    <Undo2 className="size-4" aria-hidden="true" />
                    Usar el original
                  </button>
                )}
              </div>
              {logoError && (
                <p className="mt-2 text-xs font-medium text-crimson-700 dark:text-crimson-400" role="alert">
                  {logoError}
                </p>
              )}
            </div>
          </div>

          <Field label="Nombre del negocio" htmlFor="negocio" error={errores.negocio}>
            <input
              id="negocio"
              className={inputClass}
              value={negocio}
              onChange={(e) => setNegocio(e.target.value)}
              maxLength={60}
              autoComplete="off"
            />
          </Field>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            El ícono que queda en la pantalla de inicio del celular al instalar la app no cambia con esta opción; se
            actualiza al publicar una nueva versión.
          </p>
        </section>

        {/* Datos de la empresa */}
        <section className="card space-y-5">
          <h2 className="card-title flex items-center gap-2">
            <Building2 className="size-4 text-brand-600" aria-hidden="true" />
            Datos de la empresa
          </h2>
          <p className="-mt-3 text-xs text-slate-500 dark:text-slate-400">
            Se usarán en recibos, cotizaciones y reportes. Todos los campos son opcionales.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {camposEmpresa.map((c) => (
              <div key={c.key} className={c.full ? 'sm:col-span-2' : ''}>
                <Field label={c.label} htmlFor={`emp-${c.key}`} error={errores[c.key]}>
                  <input
                    id={`emp-${c.key}`}
                    type={c.type ?? 'text'}
                    className={inputClass}
                    placeholder={c.placeholder}
                    value={empresa[c.key]}
                    onChange={(e) => setEmpresa({ ...empresa, [c.key]: e.target.value })}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        {/* Alertas */}
        <section className="card space-y-5">
          <h2 className="card-title">Alertas</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Avisar vencimiento con (días)"
              htmlFor="umbral"
              hint="Un lote se marca “por vencer” cuando le faltan estos días o menos."
              error={errores.umbral}
            >
              <input
                id="umbral"
                className={inputClass}
                inputMode="numeric"
                value={umbral}
                onChange={(e) => setUmbral(e.target.value)}
                autoComplete="off"
              />
            </Field>

            <Field
              label="Stock mínimo (unidades)"
              htmlFor="stock"
              hint="Se alerta cuando el stock total baja de este valor."
              error={errores.stock}
            >
              <input
                id="stock"
                className={inputClass}
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                autoComplete="off"
              />
            </Field>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={primaryBtn}>
            <Check className="size-4" aria-hidden="true" />
            Guardar cambios
          </button>
          {guardado && (
            <span className="text-sm font-medium text-aqua-700 dark:text-aqua-400" role="status">
              Cambios guardados
            </span>
          )}
        </div>
      </form>

      {/* Vendedores */}
      <section className="card">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="card-title">Usuarios y vendedores</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{activos} vendedores activos</p>
        </div>

        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          <li className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Administrador</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acceso total · no se puede desactivar</p>
            </div>
          </li>

          {settings.vendedores.map((v) => (
            <li key={v.id} className="flex items-center gap-3 py-3">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  v.activo
                    ? 'bg-aqua-100 text-aqua-700 dark:bg-aqua-950 dark:text-aqua-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                aria-hidden="true"
              >
                {v.nombre.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${v.activo ? '' : 'text-slate-400 line-through'}`}>
                  {v.nombre}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{v.email}</p>
              </div>
              <button
                type="button"
                onClick={() => alternarVendedor(v.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  v.activo
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                    : 'bg-aqua-100 text-aqua-800 hover:bg-aqua-200 dark:bg-aqua-950 dark:text-aqua-300'
                }`}
              >
                {v.activo ? 'Desactivar' : 'Activar'}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={onAgregar} noValidate className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
          <p className="mb-3 text-sm font-medium">Añadir vendedor</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="v-nombre" className="sr-only">
                Nombre
              </label>
              <input
                id="v-nombre"
                className={inputClass}
                placeholder="Nombre"
                value={vNombre}
                onChange={(e) => setVNombre(e.target.value)}
                maxLength={40}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="v-email" className="sr-only">
                Correo
              </label>
              <input
                id="v-email"
                type="email"
                className={inputClass}
                placeholder="Correo electrónico"
                value={vEmail}
                onChange={(e) => setVEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          {vError && (
            <p className="mt-2 text-xs font-medium text-crimson-700 dark:text-crimson-400" role="alert">
              {vError}
            </p>
          )}
          <button type="submit" className={`${primaryBtn} mt-3`}>
            <UserPlus className="size-4" aria-hidden="true" />
            Añadir vendedor
          </button>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Los vendedores desactivados no pueden entrar, pero se conserva su historial de ventas.
          </p>
        </form>
      </section>

      <section className="card">
        <h2 className="card-title">Datos de demostración</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Vuelve a los valores de ejemplo de este dispositivo.
        </p>
        <button type="button" onClick={onRestablecer} className={`${secondaryBtn} mt-3`}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Restablecer ajustes
        </button>
      </section>
    </div>
  )
}
