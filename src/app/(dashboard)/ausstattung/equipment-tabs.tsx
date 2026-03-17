"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Microscope, Shield, Armchair, Monitor, Package, Dna } from "lucide-react"

export type EquipmentStatus = "geplant" | "bestellt" | "geliefert" | "installiert"
export type EquipmentPriority = "hoch" | "mittel" | "niedrig"
export type EquipmentCategory = "Mikrobiologie" | "Molekularbiologie" | "Sicherheit" | "Möbel" | "Technik"

export interface Equipment {
  id: string | number
  name: string
  category: EquipmentCategory
  description: string | null
  quantity: number
  zone_key: string | null
  status: EquipmentStatus
  priority: EquipmentPriority
}

const STATUS_STYLES: Record<EquipmentStatus, string> = {
  geplant: "border-transparent bg-slate-800 text-slate-300",
  bestellt: "border-transparent bg-blue-900/40 text-blue-400",
  geliefert: "border-transparent bg-amber-900/40 text-amber-400",
  installiert: "border-transparent bg-green-900/40 text-green-400",
}

const STATUS_LABELS: Record<EquipmentStatus, string> = {
  geplant: "Geplant",
  bestellt: "Bestellt",
  geliefert: "Geliefert",
  installiert: "Installiert",
}

const PRIORITY_STYLES: Record<EquipmentPriority, string> = {
  hoch: "border-transparent bg-red-900/40 text-red-400",
  mittel: "border-transparent bg-yellow-900/40 text-yellow-400",
  niedrig: "border-transparent bg-green-900/40 text-green-400",
}

const PRIORITY_LABELS: Record<EquipmentPriority, string> = {
  hoch: "Hoch",
  mittel: "Mittel",
  niedrig: "Niedrig",
}

const CATEGORY_ICONS: Record<EquipmentCategory, React.ReactNode> = {
  Mikrobiologie: <Microscope className="h-3.5 w-3.5" />,
  Molekularbiologie: <Dna className="h-3.5 w-3.5" />,
  Sicherheit: <Shield className="h-3.5 w-3.5" />,
  Möbel: <Armchair className="h-3.5 w-3.5" />,
  Technik: <Monitor className="h-3.5 w-3.5" />,
}

const CATEGORIES: EquipmentCategory[] = ["Mikrobiologie", "Molekularbiologie", "Sicherheit", "Möbel", "Technik"]

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium text-muted-foreground">Keine Ausstattung vorhanden</p>
      <p className="text-sm text-muted-foreground mt-1">
        In dieser Kategorie sind noch keine Geräte oder Möbel eingetragen.
      </p>
    </div>
  )
}

function EquipmentTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) return <EmptyState />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Kategorie</TableHead>
          <TableHead>Beschreibung</TableHead>
          <TableHead className="text-right">Anzahl</TableHead>
          <TableHead>Zone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priorität</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {CATEGORY_ICONS[item.category]}
                {item.category}
              </span>
            </TableCell>
            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
              {item.description ?? "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {item.zone_key ?? "—"}
            </TableCell>
            <TableCell>
              <Badge className={STATUS_STYLES[item.status]}>
                {STATUS_LABELS[item.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={PRIORITY_STYLES[item.priority]}>
                {PRIORITY_LABELS[item.priority]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function EquipmentTabs({ items }: { items: Equipment[] }) {
  return (
    <Tabs defaultValue="alle">
      <TabsList className="mb-4">
        <TabsTrigger value="alle">
          Alle ({items.length})
        </TabsTrigger>
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat).length
          return (
            <TabsTrigger key={cat} value={cat} className="gap-1.5">
              {CATEGORY_ICONS[cat]}
              {cat} ({count})
            </TabsTrigger>
          )
        })}
      </TabsList>

      <TabsContent value="alle">
        <Card>
          <CardContent className="p-0">
            <EquipmentTable items={items} />
          </CardContent>
        </Card>
      </TabsContent>

      {CATEGORIES.map((cat) => (
        <TabsContent key={cat} value={cat}>
          <Card>
            <CardContent className="p-0">
              <EquipmentTable items={items.filter((i) => i.category === cat)} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
