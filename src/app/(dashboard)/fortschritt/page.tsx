import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Circle,
  Loader2,
  ClipboardList,
  ShoppingCart,
  Hammer,
  Microscope,
  Rocket,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'Planung' | 'Beschaffung' | 'Umbau' | 'Einrichtung' | 'Betrieb'
type MilestoneStatus = 'offen' | 'in_arbeit' | 'abgeschlossen'

interface Milestone {
  id: string
  title: string
  description: string | null
  phase: Phase
  status: MilestoneStatus
  progress: number
  start_date: string | null
  target_date: string | null
  completed_date: string | null
  sort_order: number | null
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const PHASES: Phase[] = ['Planung', 'Beschaffung', 'Umbau', 'Einrichtung', 'Betrieb']

const PHASE_CONFIG: Record<Phase, {
  icon: React.ReactNode
  accent: string
  progressBar: string
  badgeBg: string
  badgeText: string
}> = {
  Planung: {
    icon: <ClipboardList className="h-5 w-5 text-violet-400" />,
    accent: 'text-violet-400',
    progressBar: '[&>div]:bg-violet-500',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
  },
  Beschaffung: {
    icon: <ShoppingCart className="h-5 w-5 text-blue-400" />,
    accent: 'text-blue-400',
    progressBar: '[&>div]:bg-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
  },
  Umbau: {
    icon: <Hammer className="h-5 w-5 text-amber-400" />,
    accent: 'text-amber-400',
    progressBar: '[&>div]:bg-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
  },
  Einrichtung: {
    icon: <Microscope className="h-5 w-5 text-teal-400" />,
    accent: 'text-teal-400',
    progressBar: '[&>div]:bg-teal-500',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-400',
  },
  Betrieb: {
    icon: <Rocket className="h-5 w-5 text-emerald-400" />,
    accent: 'text-emerald-400',
    progressBar: '[&>div]:bg-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function statusIcon(status: MilestoneStatus) {
  switch (status) {
    case 'abgeschlossen':
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case 'in_arbeit':
      return <Loader2 className="h-4 w-4 text-blue-400" />
    default:
      return <Circle className="h-4 w-4 text-slate-600" />
  }
}

function statusLabel(status: MilestoneStatus): string {
  switch (status) {
    case 'abgeschlossen': return 'Abgeschlossen'
    case 'in_arbeit': return 'In Arbeit'
    default: return 'Offen'
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function FortschrittPage() {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400 text-sm">
          Fehler beim Laden: {error.message}
        </p>
      </div>
    )
  }

  const milestones: Milestone[] = data ?? []

  const overallProgress =
    milestones.length > 0
      ? Math.round(
          milestones.reduce((sum, m) => sum + (m.progress ?? 0), 0) / milestones.length
        )
      : 0

  const totalDone = milestones.filter((m) => m.status === 'abgeschlossen').length
  const totalInProgress = milestones.filter((m) => m.status === 'in_arbeit').length
  const totalOpen = milestones.length - totalDone - totalInProgress

  const grouped = new Map<Phase, Milestone[]>()
  for (const phase of PHASES) {
    grouped.set(phase, milestones.filter((m) => m.phase === phase))
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-8 md:px-10">
        <h1 className="text-2xl font-bold text-white">Projektfortschritt</h1>
        <p className="mt-1 text-sm text-slate-400">
          Übersicht über alle Projektphasen und Meilensteine
        </p>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-2xl font-bold text-white">{overallProgress}%</p>
            <p className="text-xs text-slate-500">Gesamtfortschritt</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-2xl font-bold text-emerald-400">{totalDone}</p>
            <p className="text-xs text-slate-500">Abgeschlossen</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-2xl font-bold text-blue-400">{totalInProgress}</p>
            <p className="text-xs text-slate-500">In Arbeit</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-2xl font-bold text-slate-400">{totalOpen}</p>
            <p className="text-xs text-slate-500">Offen</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <Progress
            value={overallProgress}
            className="h-2 bg-slate-800 [&>div]:bg-emerald-500"
          />
        </div>
      </div>

      {/* Phases */}
      <div className="px-6 py-8 md:px-10 space-y-10">
        {PHASES.map((phase) => {
          const items = grouped.get(phase) ?? []
          if (items.length === 0) return null

          const config = PHASE_CONFIG[phase]
          const doneCount = items.filter((m) => m.status === 'abgeschlossen').length
          const phaseProgress =
            Math.round(items.reduce((s, m) => s + (m.progress ?? 0), 0) / items.length)

          return (
            <section key={phase}>
              {/* Phase header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {config.icon}
                  <div>
                    <h2 className={`text-lg font-bold ${config.accent}`}>{phase}</h2>
                    <p className="text-xs text-slate-500">
                      {doneCount} von {items.length} abgeschlossen
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={phaseProgress}
                    className={`h-2 w-28 bg-slate-800 hidden sm:block ${config.progressBar}`}
                  />
                  <span className={`text-sm font-bold ${config.accent}`}>
                    {phaseProgress}%
                  </span>
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-3">
                {items.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-4 transition-colors hover:bg-slate-900"
                  >
                    {/* Status icon */}
                    <div className="shrink-0">{statusIcon(m.status)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {m.title}
                      </p>
                      {m.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {m.description}
                        </p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 shrink-0">
                      {m.completed_date ? (
                        <span className="text-emerald-400/70">
                          {formatDate(m.completed_date)}
                        </span>
                      ) : m.target_date ? (
                        <span>Ziel: {formatDate(m.target_date)}</span>
                      ) : null}
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3 shrink-0">
                      <Progress
                        value={m.progress}
                        className={`h-1.5 w-16 bg-slate-800 ${
                          m.status === 'abgeschlossen'
                            ? '[&>div]:bg-emerald-500'
                            : m.status === 'in_arbeit'
                            ? '[&>div]:bg-blue-500'
                            : '[&>div]:bg-slate-600'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-400 w-8 text-right">
                        {m.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
