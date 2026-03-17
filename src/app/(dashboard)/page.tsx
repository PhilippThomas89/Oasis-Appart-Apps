import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DnaHelix } from '@/components/dna-helix'
import {
  Euro,
  FlaskConical,
  TrendingUp,
  PackageCheck,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type Equipment = {
  id: number
  status: 'geplant' | 'bestellt' | 'geliefert' | 'installiert'
}

type Order = {
  id: number
  name?: string
  description?: string
  amount: number
  status: 'geplant' | 'bestellt' | 'geliefert' | 'storniert'
  created_at?: string
}

type Budget = {
  id: number
  category: string
  planned_amount: number
  spent_amount: number
}

type Milestone = {
  id: number
  title?: string
  status: 'offen' | 'in_arbeit' | 'abgeschlossen'
  progress: number
  phase?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function orderStatusLabel(status: Order['status']): string {
  const map: Record<Order['status'], string> = {
    geplant: 'Geplant',
    bestellt: 'Bestellt',
    geliefert: 'Geliefert',
    storniert: 'Storniert',
  }
  return map[status] ?? status
}

function orderStatusVariant(
  status: Order['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'geliefert':
      return 'default'
    case 'bestellt':
      return 'secondary'
    case 'storniert':
      return 'destructive'
    default:
      return 'outline'
  }
}

function milestoneStatusIcon(status: Milestone['status']) {
  switch (status) {
    case 'abgeschlossen':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
    case 'in_arbeit':
      return <Loader2 className="h-4 w-4 text-amber-500 shrink-0" />
    default:
      return <Circle className="h-4 w-4 text-slate-400 shrink-0" />
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Parallel data fetching
  const [
    { data: equipment },
    { data: orders },
    { data: budget },
    { data: milestones },
  ] = await Promise.all([
    supabase.from('equipment').select('*'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('budget').select('*'),
    supabase.from('milestones').select('*'),
  ])

  // ── KPI calculations ──────────────────────────────────────────────────────

  const totalPlanned = (budget ?? []).reduce(
    (sum: number, b: Budget) => sum + (b.planned_amount ?? 0),
    0
  )
  const totalSpent = (budget ?? []).reduce(
    (sum: number, b: Budget) => sum + (b.spent_amount ?? 0),
    0
  )
  const budgetProgress =
    totalPlanned > 0 ? Math.min(Math.round((totalSpent / totalPlanned) * 100), 100) : 0

  const equipmentTotal = (equipment ?? []).length
  const equipmentInstalled = (equipment ?? []).filter(
    (e: Equipment) => e.status === 'installiert'
  ).length
  const equipmentProgress =
    equipmentTotal > 0 ? Math.round((equipmentInstalled / equipmentTotal) * 100) : 0

  const milestonesAll = milestones ?? []
  const avgProgress =
    milestonesAll.length > 0
      ? Math.round(
          (milestonesAll as Milestone[]).reduce((sum, m) => sum + (m.progress ?? 0), 0) /
            milestonesAll.length
        )
      : 0

  // ── Phase grouping ────────────────────────────────────────────────────────

  const phaseMap = new Map<string, Milestone[]>()
  for (const m of milestonesAll as Milestone[]) {
    const phase = m.phase ?? 'Allgemein'
    if (!phaseMap.has(phase)) phaseMap.set(phase, [])
    phaseMap.get(phase)!.push(m)
  }
  const phases = Array.from(phaseMap.entries())

  const recentOrders = (orders ?? []) as Order[]

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Hero Header mit DNA-Video ── */}
      <header className="relative overflow-hidden rounded-b-3xl">
        {/* DNA Helix Background */}
        <DnaHelix />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-emerald-950/30 to-slate-950/50" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <FlaskConical className="h-7 w-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Biologielabor Raum 168
              </h1>
              <p className="mt-0.5 text-sm text-emerald-200/80">
                Emil-Fischer-Gymnasium Schwarzheide — MINT-Profilschule
              </p>
            </div>
          </div>

          {/* Mini-Stats im Header */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3">
              <p className="text-2xl font-bold text-white">{equipmentTotal}</p>
              <p className="text-xs text-emerald-200/70">Artikel gesamt</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3">
              <p className="text-2xl font-bold text-emerald-300">
                {(equipment ?? []).filter((e: Equipment) => e.status === 'geliefert').length}
              </p>
              <p className="text-xs text-emerald-200/70">Geliefert</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3">
              <p className="text-2xl font-bold text-white">{formatEuro(totalSpent)}</p>
              <p className="text-xs text-emerald-200/70">Ausgegeben</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3">
              <p className="text-2xl font-bold text-amber-300">{avgProgress} %</p>
              <p className="text-xs text-emerald-200/70">Fortschritt</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* ── KPI Cards ── */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Übersicht
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Budget */}
            <Card className="border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Budget
                </CardTitle>
                <Euro className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="space-y-2">
                {totalPlanned === 0 ? (
                  <p className="text-sm text-slate-400">Keine Daten</p>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-100">
                      {formatEuro(totalSpent)}
                    </div>
                    <p className="text-xs text-slate-500">
                      von {formatEuro(totalPlanned)} Gesamtbudget
                    </p>
                    <Progress
                      value={budgetProgress}
                      className="h-2 bg-emerald-900/30 [&>div]:bg-emerald-500"
                    />
                    <p className="text-xs text-slate-400">{budgetProgress} % ausgegeben</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Ausstattung */}
            <Card className="border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Ausstattung
                </CardTitle>
                <PackageCheck className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="space-y-2">
                {equipmentTotal === 0 ? (
                  <p className="text-sm text-slate-400">Keine Daten</p>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-100">
                      {equipmentInstalled}{' '}
                      <span className="text-base font-normal text-slate-400">
                        von {equipmentTotal}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Geräte installiert</p>
                    <Progress
                      value={equipmentProgress}
                      className="h-2 bg-emerald-900/30 [&>div]:bg-emerald-500"
                    />
                    <p className="text-xs text-slate-400">{equipmentProgress} % installiert</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Projektfortschritt */}
            <Card className="border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Projektfortschritt
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="space-y-2">
                {milestonesAll.length === 0 ? (
                  <p className="text-sm text-slate-400">Keine Daten</p>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-100">
                      {avgProgress} %
                    </div>
                    <p className="text-xs text-slate-500">
                      Ø Fortschritt aller Meilensteine
                    </p>
                    <Progress
                      value={avgProgress}
                      className="h-2 bg-emerald-900/30 [&>div]:bg-emerald-500"
                    />
                    <p className="text-xs text-slate-400">
                      {milestonesAll.length} Meilenstein
                      {milestonesAll.length !== 1 ? 'e' : ''} gesamt
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ── Two-column layout: Orders + Phases ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ── Recent Orders ── */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Letzte Bestellungen
            </h2>
            <Card className="border-slate-800">
              <CardContent className="p-0">
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
                    <Clock className="h-8 w-8" />
                    <p className="text-sm">Keine Bestellungen vorhanden</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-800">
                    {recentOrders.map((order) => (
                      <li
                        key={order.id}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">
                            {order.name ?? order.description ?? `Bestellung #${order.id}`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatEuro(order.amount)}
                            {order.created_at
                              ? ` · ${new Date(order.created_at).toLocaleDateString('de-DE')}`
                              : ''}
                          </p>
                        </div>
                        <Badge
                          variant={orderStatusVariant(order.status)}
                          className={
                            order.status === 'geliefert'
                              ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/30'
                              : undefined
                          }
                        >
                          {orderStatusLabel(order.status)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>

          {/* ── Phase Overview ── */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Phasenübersicht
            </h2>
            {phases.length === 0 ? (
              <Card className="border-slate-800">
                <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
                  <TrendingUp className="h-8 w-8" />
                  <p className="text-sm">Keine Meilensteine vorhanden</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {phases.map(([phase, items]) => {
                  const phaseAvg = Math.round(
                    items.reduce((s, m) => s + (m.progress ?? 0), 0) / items.length
                  )
                  return (
                    <Card key={phase} className="border-slate-800">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-semibold text-slate-200">
                            {phase}
                          </CardTitle>
                          <span className="text-sm font-medium text-emerald-600">
                            {phaseAvg} %
                          </span>
                        </div>
                        <Progress
                          value={phaseAvg}
                          className="h-2 bg-emerald-900/30 [&>div]:bg-emerald-500"
                        />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {items.map((milestone) => (
                            <li
                              key={milestone.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              {milestoneStatusIcon(milestone.status)}
                              <span className="flex-1 truncate text-slate-300">
                                {milestone.title ?? `Meilenstein #${milestone.id}`}
                              </span>
                              <span className="shrink-0 text-xs text-slate-400">
                                {milestone.progress ?? 0} %
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-400">
            Biologielabor Raum 168 · Emil-Fischer-Gymnasium Schwarzheide ·{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
