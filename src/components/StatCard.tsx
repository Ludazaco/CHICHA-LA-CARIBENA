import type { LucideIcon } from 'lucide-react'

type Tone = 'orange' | 'teal' | 'rose' | 'amber' | 'stone'

const tones: Record<Tone, string> = {
  orange: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  teal: 'bg-aqua-100 text-aqua-700 dark:bg-aqua-950 dark:text-aqua-300',
  rose: 'bg-crimson-100 text-crimson-700 dark:bg-crimson-950 dark:text-crimson-300',
  amber: 'bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300',
  stone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
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
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}
