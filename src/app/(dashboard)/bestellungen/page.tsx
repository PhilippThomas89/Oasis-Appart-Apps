import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Euro,
  Package,
  Truck,
  ShoppingCart,
  Wallet,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type OrderStatus = 'geplant' | 'bestellt' | 'geliefert' | 'storniert'

interface Order {
  id: string
  supplier: string | null
  description: string | null
  category: string | null
  amount: number | null
  status: OrderStatus | null
  order_date: string | null
  delivery_date: string | null
  invoice_number: string | null
  notes: string | null
}

interface Budget {
  id: string
  category: string | null
  planned_amount: number | null
  spent_amount: number | null
  funding_source: string | null
  notes: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatEuro(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}

// ── Status Badge ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  geplant: {
    label: 'Geplant',
    className:
      'border-transparent bg-slate-800 text-slate-300 hover:bg-slate-800',
  },
  bestellt: {
    label: 'Bestellt',
    className:
      'border-transparent bg-blue-900/40 text-blue-400 hover:bg-blue-900/40',
  },
  geliefert: {
    label: 'Geliefert',
    className:
      'border-transparent bg-green-900/40 text-green-400 hover:bg-green-900/40',
  },
  storniert: {
    label: 'Storniert',
    className: 'border-transparent bg-red-900/40 text-red-400 hover:bg-red-900/40',
  },
}

function StatusBadge({ status }: { status: OrderStatus | null }) {
  if (!status) return <Badge variant="outline">Unbekannt</Badge>
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: '',
  }
  return <Badge className={config.className}>{config.label}</Badge>
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function BestellungenPage() {
  const [{ data: ordersRaw }, { data: budgetRaw }] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false }),
    supabase.from('budget').select('*'),
  ])

  const orders: Order[] = ordersRaw ?? []
  const budget: Budget[] = budgetRaw ?? []

  // ── Derived totals ────────────────────────────────────────────────────────
  const totalPlanned = budget.reduce(
    (sum, b) => sum + (b.planned_amount ?? 0),
    0
  )
  const totalSpent = budget.reduce(
    (sum, b) => sum + (b.spent_amount ?? 0),
    0
  )
  const totalOrders = orders.length
  const pendingOrders = orders.filter(
    (o) => o.status === 'geplant' || o.status === 'bestellt'
  ).length

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bestellungen &amp; Budget
          </h1>
          <p className="text-sm text-muted-foreground">
            Übersicht aller Bestellungen und Budgetpositionen des Biologielabors
          </p>
        </div>
      </div>

      {/* ── KPI Summary Row ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900/40 text-blue-400">
              <Euro className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gesamtbudget</p>
              <p className="text-lg font-semibold">{formatEuro(totalPlanned)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-900/40 text-green-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ausgegeben</p>
              <p className="text-lg font-semibold">{formatEuro(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-amber-400">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bestellungen</p>
              <p className="text-lg font-semibold">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ausstehend</p>
              <p className="text-lg font-semibold">{pendingOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Budget Overview Cards ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          Budgetübersicht nach Kategorie
        </h2>

        {budget.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Keine Budgetdaten vorhanden.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budget.map((b) => {
              const planned = b.planned_amount ?? 0
              const spent = b.spent_amount ?? 0
              const percent = planned > 0 ? (spent / planned) * 100 : 0
              const remaining = planned - spent
              const isOverBudget = spent > planned

              return (
                <Card key={b.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between gap-2">
                      <span className="truncate">
                        {b.category ?? 'Unbekannte Kategorie'}
                      </span>
                      {isOverBudget && (
                        <Badge className="border-transparent bg-red-900/40 text-red-400 text-xs shrink-0">
                          Überzogen
                        </Badge>
                      )}
                    </CardTitle>
                    {b.funding_source && (
                      <p className="text-xs text-muted-foreground truncate">
                        {b.funding_source}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress
                      value={clampPercent(percent)}
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : percent >= 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Ausgegeben:{' '}
                        <span className="font-medium text-foreground">
                          {formatEuro(spent)}
                        </span>
                      </span>
                      <span>
                        Geplant:{' '}
                        <span className="font-medium text-foreground">
                          {formatEuro(planned)}
                        </span>
                      </span>
                    </div>
                    <div className="text-xs">
                      {isOverBudget ? (
                        <span className="text-red-400 font-medium">
                          {formatEuro(Math.abs(remaining))} überzogen
                        </span>
                      ) : (
                        <span className="text-green-400 font-medium">
                          {formatEuro(remaining)} verbleibend (
                          {Math.round(clampPercent(percent))}% genutzt)
                        </span>
                      )}
                    </div>
                    {b.notes && (
                      <p className="text-xs text-muted-foreground border-t pt-2">
                        {b.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {/* Total summary card */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Gesamt
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Alle Kategorien
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress
                  value={clampPercent(
                    totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0
                  )}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Ausgegeben:{' '}
                    <span className="font-semibold text-foreground">
                      {formatEuro(totalSpent)}
                    </span>
                  </span>
                  <span>
                    Geplant:{' '}
                    <span className="font-semibold text-foreground">
                      {formatEuro(totalPlanned)}
                    </span>
                  </span>
                </div>
                <div className="text-xs font-medium">
                  {totalPlanned > 0 && (
                    <span className={totalSpent > totalPlanned ? 'text-red-400' : 'text-green-400'}>
                      {formatEuro(Math.abs(totalPlanned - totalSpent))}{' '}
                      {totalSpent > totalPlanned ? 'überzogen' : 'verbleibend'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* ── Orders Table ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          Bestellungen
        </h2>

        <Card>
          {orders.length === 0 ? (
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Keine Bestellungen vorhanden.
              </p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Beschreibung</TableHead>
                    <TableHead className="min-w-[130px]">Lieferant</TableHead>
                    <TableHead className="min-w-[120px]">Kategorie</TableHead>
                    <TableHead className="text-right min-w-[100px]">Betrag</TableHead>
                    <TableHead className="min-w-[110px]">Status</TableHead>
                    <TableHead className="min-w-[110px]">Bestelldatum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div>
                          <span>{order.description ?? '—'}</span>
                          {order.invoice_number && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Rechnung: {order.invoice_number}
                            </p>
                          )}
                          {order.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5 italic">
                              {order.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.supplier ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.category ? (
                          <Badge variant="outline" className="text-xs font-normal">
                            {order.category}
                          </Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatEuro(order.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground tabular-nums">
                        {formatDate(order.order_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </section>

    </div>
  )
}
