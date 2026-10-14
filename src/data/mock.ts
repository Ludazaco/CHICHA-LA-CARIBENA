// DATOS DE EJEMPLO. Se reemplazarán por vistas/consultas de Supabase.

const DAY = 86_400_000

export const iso = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * DAY)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dd}`
}

// Pseudo-aleatorio determinista para que el ejemplo sea estable entre recargas.
const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export type DiaVentas = { date: string; contado: number; credito: number }

export const ventas30: DiaVentas[] = Array.from({ length: 30 }, (_, i) => {
  const off = i - 29
  const dow = new Date(Date.now() + off * DAY).getDay()
  const finDeSemana = [0, 5, 6].includes(dow) ? 1.25 : 1
  const total = Math.round((380_000 + rnd(i + 1) * 320_000) * finDeSemana / 1000) * 1000
  const credito = Math.round((total * (0.2 + rnd(i + 50) * 0.2)) / 1000) * 1000
  return { date: iso(off), contado: total - credito, credito }
})

export const config = {
  umbralVencimientoDias: 15,
  stockMinimo: 500,
  ratioCosto: 0.42, // costo de producción como % de la venta (ejemplo)
}

export const gastos30 = [
  { categoria: 'Insumos', monto: 1_450_000 },
  { categoria: 'Transporte', monto: 620_000 },
  { categoria: 'Servicios', monto: 480_000 },
  { categoria: 'Otros', monto: 600_000 },
]

export type Lote = { codigo: string; produccion: string; vence: string; producido: number; stock: number }

export const lotes: Lote[] = [
  { codigo: 'L-2609-04', produccion: iso(-60), vence: iso(-2), producido: 300, stock: 12 },
  { codigo: 'L-2610-01', produccion: iso(-40), vence: iso(5), producido: 300, stock: 48 },
  { codigo: 'L-2610-02', produccion: iso(-25), vence: iso(20), producido: 300, stock: 140 },
  { codigo: 'L-2610-03', produccion: iso(-10), vence: iso(35), producido: 300, stock: 260 },
]

export const clientesSaldo = [
  { nombre: 'Tienda La Esquina', saldo: 860_000, dias: 42 },
  { nombre: 'Restaurante El Fogón', saldo: 540_000, dias: 18 },
  { nombre: 'Doña Marta', saldo: 320_000, dias: 9 },
  { nombre: 'Kiosco Playa Azul', saldo: 210_000, dias: 4 },
  { nombre: 'Carlos R.', saldo: 95_000, dias: 2 },
]

export const vendedores = [
  { nombre: 'Carlos', hoy: 410_000, mes: 8_950_000 },
  { nombre: 'Andrea', hoy: 320_000, mes: 7_420_000 },
  { nombre: 'Luis', hoy: 175_000, mes: 4_180_000 },
]

export const miCaja = { contado: 410_000 - 120_000, abonos: 85_000, credito: 120_000 }
