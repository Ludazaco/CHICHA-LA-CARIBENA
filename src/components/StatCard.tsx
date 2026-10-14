import type { LucideIcon } from 'lucide-react'

type Tone = 'orange' | 'teal' | 'rose' | 'amber' | 'stone'

const tones: Record<Tone, string> = {
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  stone: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
}

type Props = {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: Tone
}

export default function StatCard({ label, value, hint, icon: Icon, tone = 'orange' }: Props) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</p>
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{hint}</p>}
    </div>
  )
}
