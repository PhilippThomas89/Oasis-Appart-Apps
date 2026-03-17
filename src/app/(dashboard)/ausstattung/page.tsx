import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, ShoppingCart, Truck, CheckCircle2 } from "lucide-react"
import { EquipmentTabs, type Equipment } from "./equipment-tabs"

// ── Status summary card config ───────────────────────────────────────────────

const STATUS_CARDS = [
  {
    status: "geplant" as const,
    label: "Geplant",
    icon: ClipboardList,
    iconClass: "text-slate-400",
    bgClass: "bg-slate-950/50",
    borderClass: "border-slate-800",
    valueClass: "text-slate-200",
  },
  {
    status: "bestellt" as const,
    label: "Bestellt",
    icon: ShoppingCart,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-950/30",
    borderClass: "border-blue-800",
    valueClass: "text-blue-400",
  },
  {
    status: "geliefert" as const,
    label: "Geliefert",
    icon: Truck,
    iconClass: "text-amber-400",
    bgClass: "bg-amber-950/30",
    borderClass: "border-amber-800",
    valueClass: "text-amber-300",
  },
  {
    status: "installiert" as const,
    label: "Installiert",
    icon: CheckCircle2,
    iconClass: "text-green-400",
    bgClass: "bg-green-950/30",
    borderClass: "border-green-800",
    valueClass: "text-green-400",
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AusstattungPage() {
  const { data, error } = await supabase
    .from("equipment")
    .select("id, name, category, description, quantity, zone_key, status, priority")
    .order("name", { ascending: true })

  // On error or missing table, fall back to an empty list so the page still renders
  const items: Equipment[] = (error ? [] : data) ?? []

  // Count by status
  const countByStatus = STATUS_CARDS.reduce(
    (acc, { status }) => {
      acc[status] = items.filter((i) => i.status === status).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ausstattung &amp; Geräte</h1>
        <p className="mt-1 text-muted-foreground">
          Übersicht aller Geräte, Möbel und Materialien des Biologielabors
        </p>
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATUS_CARDS.map(({ status, label, icon: Icon, iconClass, bgClass, borderClass, valueClass }) => (
          <Card key={status} className={`border ${borderClass} ${bgClass}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${iconClass}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className={`text-3xl font-bold ${valueClass}`}>
                {countByStatus[status] ?? 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {countByStatus[status] === 1 ? "Artikel" : "Artikel"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Equipment table with category filter tabs ─────────────────────── */}
      <EquipmentTabs items={items} />
    </div>
  )
}
