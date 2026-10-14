import { Hammer } from 'lucide-react'

type Props = {
  title: string
  fase: string
  descripcion: string
  puntos: string[]
}

export default function Placeholder({ title, fase, descripcion, puntos }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{descripcion}</p>

      <div className="card mt-6 max-w-xl">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Hammer className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Módulo en construcción</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{fase}</p>
          </div>
        </div>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-stone-600 dark:text-stone-300">
          {puntos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
