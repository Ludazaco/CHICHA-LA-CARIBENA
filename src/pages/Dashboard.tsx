import { Link } from 'react-router-dom'
import {
  Banknote,
  Database,
  HandCoins,
  PackageCheck,
  PlusCircle,
  Receipt,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import SalesChart from '../components/SalesChart'
import { useRole } from '../lib/role'
import { supabaseConfigured } from '../lib/supabase'
import { daysUntil, fmtDate, money } from '../lib/format'
import { clientesSaldo, config, gastos30, lotes, miCaja, vendedores, ventas30, type Lote } from '../data/mock'

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

type Tipo = 'vencido' | 'por_vencer' | 'ok'

function estadoLote(l: Lote): { tipo: Tipo; dias: number } {
  const dias = daysUntil(l.vence)
  if (dias < 0) return { tipo: 'vencido', dias }
  if (dias <= config.umbralVencimientoDias) return { tipo: 'por_vencer', dias }
  return { tipo: 'ok', dias }
}

const badgeStyle: Record<Tipo, string> = {
  vencido: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  por_vencer: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  ok: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
}

const badgeText = (tipo: Tipo, dias: number) =>
  tipo === 'vencido' ? `Vencido hace ${-dias} d` : `Vence en ${dias} d`

function DemoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <Database className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        <strong>Datos de ejemplo.</strong>{' '}
        {supabaseConfigured
          ? 'Variables de Supabase detectadas: listo para conectar datos reales.'
          : 'Supabase aún no está configurado (faltan las variables de entorno).'}
      </p>
    </div>
  )
}

function LotesCard() {
  return (
    <section className="card">
      <h2 className="card-title">Stock por lote</h2>
      <ul className="mt-3 space-y-4">
        {lotes.map((l) => {
          const { tipo, dias } = estadoLote(l)
          const pct = Math.round((l.stock / l.producido) * 100)
          return (
            <li key={l.codigo}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{l.codigo}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeStyle[tipo]}`}>
                  {badgeText(tipo, dias)}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                <div
                  className={`h-full rounded-full ${tipo === 'vencido' ? 'bg-rose-500' : 'bg-orange-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {l.stock} de {l.producido} und · vence {fmtDate(l.vence)}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function AdminDashboard() {
  const hoy = ventas30[ventas30.length - 1]
  const ventasHoy = hoy.contado + hoy.credito
  const ventas30d = sum(ventas30.map((d) => d.contado + d.credito))
  const contado30 = sum(ventas30.map((d) => d.contado))
  const credito30 = sum(ventas30.map((d) => d.credito))
  const gastos = sum(gastos30.map((g) => g.monto))
  const costo = Math.round(ventas30d * config.ratioCosto)
  const utilidad = ventas30d - costo - gastos
  const porCobrar = sum(clientesSaldo.map((c) => c.saldo))
  const stockTotal = sum(lotes.map((l) => l.stock))
  const maxVend = Math.max(...vendedores.map((v) => v.mes))

  const alertas: { tone: 'rose' | 'amber'; titulo: string; detalle: string }[] = []
  lotes.forEach((l) => {
    const { tipo, dias } = estadoLote(l)
    if (tipo === 'vencido' && l.stock > 0)
      alertas.push({
        tone: 'rose',
        titulo: `Lote ${l.codigo} vencido`,
        detalle: `${l.stock} und en existencia · venció hace ${-dias} d`,
      })
    if (tipo === 'por_vencer')
      alertas.push({
        tone: 'amber',
        titulo: `Lote ${l.codigo} por vencer`,
        detalle: `${l.stock} und · vence en ${dias} d (${fmtDate(l.vence)})`,
      })
  })
  if (stockTotal < config.stockMinimo)
    alertas.push({
      tone: 'amber',
      titulo: 'Stock total bajo',
      detalle: `${stockTotal} und disponibles · mínimo configurado ${config.stockMinimo}`,
    })

  const alertStyle = {
    rose: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Vista del administrador · últimos 30 días</p>
      </div>

      <DemoBanner />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Ventas de hoy" value={money(ventasHoy)} hint="Contado + crédito" icon={Banknote} />
        <StatCard label="Ventas (30 días)" value={money(ventas30d)} hint={`Crédito: ${money(credito30)}`} icon={TrendingUp} tone="teal" />
        <StatCard label="Gastos (30 días)" value={money(gastos)} hint="Insumos, transporte y más" icon={Receipt} tone="rose" />
        <StatCard label="Utilidad estimada" value={money(utilidad)} hint="Ventas − costo − gastos" icon={Wallet} tone="teal" />
        <StatCard label="Cobrado de contado" value={money(contado30)} hint="Dinero realmente recibido" icon={HandCoins} tone="amber" />
        <StatCard label="Por cobrar (cartera)" value={money(porCobrar)} hint={`${clientesSaldo.length} clientes con saldo`} icon={HandCoins} tone="stone" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <h2 className="card-title">Ventas de los últimos 30 días</h2>
          <div className="mt-3">
            <SalesChart data={ventas30} />
          </div>
        </section>

        <section className="card">
          <h2 className="card-title flex items-center gap-2">
            <TriangleAlert className="size-4 text-amber-600" aria-hidden="true" />
            Alertas
          </h2>
          {alertas.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">Todo en orden.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {alertas.map((a) => (
                <li key={a.titulo} className={`rounded-xl border p-3 ${alertStyle[a.tone]}`}>
                  <p className="text-sm font-semibold">{a.titulo}</p>
                  <p className="mt-0.5 text-xs opacity-90">{a.detalle}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LotesCard />
        </div>

        <section className="card">
          <h2 className="card-title">Clientes con mayor saldo</h2>
          <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
            {clientesSaldo.map((c) => (
              <li key={c.nombre} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.nombre}</p>
                  <p
                    className={`text-xs ${
                      c.dias > 30 ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {c.dias} días con saldo
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{money(c.saldo)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="card-title">Ventas por vendedor (30 días)</h2>
          <ul className="mt-3 space-y-4">
            {vendedores.map((v) => (
              <li key={v.nombre}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium">{v.nombre}</p>
                  <p className="text-sm font-semibold">{money(v.mes)}</p>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${(v.mes / maxVend) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Hoy: {money(v.hoy)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function VendedorDashboard() {
  const yo = vendedores[0]
  const disponibles = lotes.filter((l) => estadoLote(l).tipo !== 'vencido' && l.stock > 0)
  const stockDisponible = sum(disponibles.map((l) => l.stock))
  const fefo = [...disponibles].sort((a, b) => a.vence.localeCompare(b.vence))[0]
  const cajaTotal = miCaja.contado + miCaja.abonos

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hola, {yo.nombre}</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Vista del vendedor</p>
      </div>

      <DemoBanner />

      <Link
        to="/ventas"
        className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-4 text-base font-semibold text-white shadow-sm active:bg-orange-700"
      >
        <PlusCircle className="size-5" aria-hidden="true" />
        Nueva venta
      </Link>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Mis ventas de hoy" value={money(yo.hoy)} hint={`Crédito: ${money(miCaja.credito)}`} icon={Banknote} />
        <StatCard label="Mi caja de hoy" value={money(cajaTotal)} hint="Contado + abonos recibidos" icon={Wallet} tone="teal" />
        <div className="col-span-2 lg:col-span-1">
          <StatCard label="Stock disponible" value={`${stockDisponible} und`} hint="Sin contar lotes vencidos" icon={PackageCheck} tone="amber" />
        </div>
      </div>

      {fefo && (
        <section className="card">
          <h2 className="card-title">Lote sugerido para vender (vence primero)</h2>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold">{fefo.codigo}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {fefo.stock} und · vence {fmtDate(fefo.vence)}
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyle[estadoLote(fefo).tipo]}`}>
              {badgeText(estadoLote(fefo).tipo, estadoLote(fefo).dias)}
            </span>
          </div>
        </section>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { role } = useRole()
  return role === 'admin' ? <AdminDashboard /> : <VendedorDashboard />
}
