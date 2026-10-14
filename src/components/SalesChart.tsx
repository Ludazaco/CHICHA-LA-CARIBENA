import { compact, money } from '../lib/format'
import type { DiaVentas } from '../data/mock'

const dm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export default function SalesChart({ data }: { data: DiaVentas[] }) {
  const W = 600
  const H = 210
  const padL = 40
  const padB = 22
  const padT = 8

  const max = Math.max(...data.map((d) => d.contado + d.credito))
  const top = Math.ceil(max / 200_000) * 200_000
  const bw = (W - padL) / data.length
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / top)
  const ticks = [0, 0.5, 1].map((f) => top * f)
  const total = data.reduce((s, d) => s + d.contado + d.credito, 0)

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Ventas de los últimos 30 días, total ${money(total)}`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={W}
              y1={y(t)}
              y2={y(t)}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={1}
            />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" className="fill-slate-500 text-[10px]">
              {compact(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = padL + i * bw + bw * 0.15
          const w = bw * 0.7
          const yContado = y(d.contado)
          const yTotal = y(d.contado + d.credito)
          return (
            <g key={d.date}>
              <title>{`${dm(d.date)} · Contado ${money(d.contado)} · Crédito ${money(d.credito)}`}</title>
              <rect x={x} y={yContado} width={w} height={y(0) - yContado} rx={2} className="fill-brand-500" />
              <rect x={x} y={yTotal} width={w} height={yContado - yTotal} rx={2} className="fill-gold-500" />
            </g>
          )
        })}

        {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
          <text
            key={i}
            x={padL + i * bw + bw / 2}
            y={H - 6}
            textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
            className="fill-slate-500 text-[10px]"
          >
            {dm(data[i].date)}
          </text>
        ))}
      </svg>

      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-500" /> Contado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-gold-500" /> Crédito
        </span>
      </figcaption>
    </figure>
  )
}
