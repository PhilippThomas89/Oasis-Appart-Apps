"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Microscope,
  Wind,
  Monitor,
  GraduationCap,
  DoorOpen,
  Palette,
  Droplets,
  ShieldCheck,
  Maximize2,
  Users,
  FlaskConical,
  Zap,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

type ZoneCategory =
  | "labor"
  | "arbeitsplaetze"
  | "hygiene"
  | "medien"
  | "kunst"
  | "zugang";

type Zone = {
  id: string;
  label: string;
  shortLabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  category: ZoneCategory;
  icon: React.ReactNode;
  description: string;
  details: string[];
  equipment?: string[];
};

// ─── Category config ────────────────────────────────────────────────────────────

const CATEGORIES: Record<
  ZoneCategory,
  { label: string; bg: string; border: string; text: string }
> = {
  labor: {
    label: "Laborinfrastruktur",
    bg: "bg-emerald-950/30",
    border: "border-emerald-800",
    text: "text-emerald-400",
  },
  arbeitsplaetze: {
    label: "Arbeitsplätze",
    bg: "bg-amber-950/30",
    border: "border-amber-800",
    text: "text-amber-400",
  },
  hygiene: {
    label: "Hygiene & Sicherheit",
    bg: "bg-sky-950/30",
    border: "border-sky-800",
    text: "text-sky-400",
  },
  medien: {
    label: "Medien & Präsentation",
    bg: "bg-violet-950/30",
    border: "border-violet-800",
    text: "text-violet-400",
  },
  kunst: {
    label: "Kunstbereich",
    bg: "bg-rose-950/30",
    border: "border-rose-800",
    text: "text-rose-400",
  },
  zugang: {
    label: "Zugänge",
    bg: "bg-slate-950/50",
    border: "border-slate-800",
    text: "text-slate-400",
  },
};

// ─── SVG zone fill colors ──────────────────────────────────────────────────────
// viewBox = 800 x 1300 → x-Achse = 8m (Kurzwand), y-Achse = 13m (Langwand)
// Oben = Kurzwand oben, Unten = Kurzwand Tafelseite
// Rechts = Fensterseite (13m lange Wand), Links = Türseite / Waschbecken

const ZONE_FILLS: Record<
  ZoneCategory,
  { fill: string; stroke: string; hoverFill: string }
> = {
  labor: { fill: "#064e3b", stroke: "#34d399", hoverFill: "#065f46" },
  arbeitsplaetze: { fill: "#451a03", stroke: "#fbbf24", hoverFill: "#78350f" },
  hygiene: { fill: "#082f49", stroke: "#38bdf8", hoverFill: "#0c4a6e" },
  medien: { fill: "#2e1065", stroke: "#a78bfa", hoverFill: "#3b0764" },
  kunst: { fill: "#4c0519", stroke: "#fb7185", hoverFill: "#881337" },
  zugang: { fill: "#0f172a", stroke: "#94a3b8", hoverFill: "#1e293b" },
};

// ─── Zone data ─────────────────────────────────────────────────────────────────
// Koordinaten in viewBox 800 (Breite=8m) x 1300 (Höhe=13m)
// Rechte Seite = Fensterseite (lange Wand, 13m)
// Linke Seite = Türseite / Waschbecken
// Oben/Unten = Kurzwände (8m)

const ZONES: Zone[] = [
  // === LABORZEILE (Fensterseite, rechte Wand, 13m lang) ===
  {
    id: "laborzeile",
    label: "Laborzeile (Fensterseite)",
    shortLabel: "Laborzeile",
    x: 660,
    y: 20,
    w: 80,
    h: 1110,
    category: "labor",
    icon: <FlaskConical className="h-5 w-5" />,
    description:
      "13 m durchgehende Laborarbeitsplatte mit abschließbaren Unterschränken — einzige Laborfläche im Raum",
    details: [
      "Arbeitsplatte: Epoxidharz oder Trespa, Tiefe mind. 70 cm",
      "Durchgehende abschließbare Unterschrankreihe (ca. 13 m)",
      "Schubkästen-Schränke integriert",
      "Mind. 6–8 Steckdosen, getrennte Stromkreise",
      "Einzige Lagerfläche im Raum",
    ],
    equipment: [
      "Inkubator (Brutschrank)",
      "Labor-Kühlschrank",
      "Autoklav",
      "Eppendorfzentrifuge",
      "PCR-Cycler",
      "Wasserbad",
      "Vortex Schüttler",
      "Mikrowelle",
      "pH-Meter",
      "Heizplatten",
    ],
  },
  {
    id: "fenster",
    label: "Fensterfront",
    shortLabel: "Fenster",
    x: 750,
    y: 20,
    w: 30,
    h: 1260,
    category: "zugang",
    icon: <Maximize2 className="h-5 w-5" />,
    description: "Fensterfront entlang der gesamten rechten Längsseite (13 m)",
    details: [
      "13 m Fensterfront",
      "Natürliche Beleuchtung und Belüftung",
      "Fenster im Laminar-Flow-Bereich nicht öffenbar",
    ],
  },

  // === LAMINAR FLOW (obere Kurzwand, Ecke zur Fensterseite) ===
  {
    id: "laminar",
    label: "Laminar-Flow-Werkbank",
    shortLabel: "Laminar Flow",
    x: 530,
    y: 20,
    w: 120,
    h: 80,
    category: "labor",
    icon: <Wind className="h-5 w-5" />,
    description:
      "Sterile Werkbank an der oberen Kurzwand, erschütterungsarme Position",
    details: [
      "Position: obere Kurzwand, Ecke zur Fensterseite",
      "120–150 cm Breite",
      "Eigener, separater Stromanschluss",
      "Erschütterungsarme Position",
      "Keine Zugluft — Fenster nicht öffenbar",
    ],
  },

  // === WASCHBEREICH (linke Wand, Türseite) ===
  {
    id: "waschbereich",
    label: "Wasch- & Desinfektionsbereich",
    shortLabel: "Waschbereich",
    x: 20,
    y: 580,
    w: 60,
    h: 400,
    category: "hygiene",
    icon: <Droplets className="h-5 w-5" />,
    description:
      "Zentraler Hygienebereich mit Waschbecken, Desinfektionsstationen und Eismaschine",
    details: [
      "Mehrere Laborwaschbecken (Warm-/Kaltwasser)",
      "Eismaschine (Flockeneisbereiter) — benötigt Wasseranschluss + Ablauf",
      "Desinfektionsmittelspender (Wandmontage)",
      "Papierhandtuchspender",
      "Abwurfbehälter",
      "Augendusche in unmittelbarer Nähe",
      "Auch vom Kunstkurs nutzbar",
    ],
  },
  {
    id: "erstehilfe",
    label: "Erste Hilfe & Notfall",
    shortLabel: "Erste Hilfe",
    x: 20,
    y: 480,
    w: 60,
    h: 90,
    category: "hygiene",
    icon: <ShieldCheck className="h-5 w-5" />,
    description: "Erste-Hilfe-Station und Notfallausstattung",
    details: [
      "Erste-Hilfe-Kasten",
      "Feuerlöscher + Löschdecke",
      "Feuermelder (deaktivierbar für Bunsenbrenner-Betrieb)",
      "Entsorgung: Bio-Abfälle + Glasabfälle (verschließbar)",
    ],
  },

  // === KUNST-SCHRÄNKE ===
  {
    id: "kunst_oben",
    label: "Kunstschränke (oben)",
    shortLabel: "Kunst",
    x: 200,
    y: 20,
    w: 310,
    h: 45,
    category: "kunst",
    icon: <Palette className="h-5 w-5" />,
    description: "Kunstmaterial-Lagerung an der oberen Kurzwand",
    details: [
      "Gemeinsam mit Kunstlehrkräften",
      "Mobile Lagermöglichkeiten (Rollwagen, Transportkisten)",
      "Während Mikrobiologie gesperrt",
    ],
  },
  {
    id: "kunst_links",
    label: "Kunstschränke (links)",
    shortLabel: "Kunst",
    x: 20,
    y: 80,
    w: 50,
    h: 380,
    category: "kunst",
    icon: <Palette className="h-5 w-5" />,
    description: "Kunstschränke an der linken Wand",
    details: ["Gemeinsam mit Kunstlehrkräften", "Abschließbar"],
  },
  {
    id: "kunst_unten",
    label: "Kunstschrank (unten)",
    shortLabel: "Kunst",
    x: 100,
    y: 1235,
    w: 170,
    h: 45,
    category: "kunst",
    icon: <Palette className="h-5 w-5" />,
    description: "Kunstschrank an der unteren Wand",
    details: ["Gemeinsam mit Kunstlehrkräften"],
  },

  // === TÜREN ===
  {
    id: "tuer2",
    label: "Tür 2 (Nebeneingang)",
    shortLabel: "Tür 2",
    x: 100,
    y: 20,
    w: 80,
    h: 40,
    category: "zugang",
    icon: <DoorOpen className="h-5 w-5" />,
    description: "Zweiter Eingang an der oberen Kurzwand",
    details: ["Nebeneingang"],
  },
  {
    id: "tuer1",
    label: "Haupteingang",
    shortLabel: "Tür 1",
    x: 20,
    y: 1010,
    w: 70,
    h: 80,
    category: "zugang",
    icon: <DoorOpen className="h-5 w-5" />,
    description: "Haupteingang an der linken Wand (unten)",
    details: ["Haupteingang zum Raum"],
  },

  // === SCHÜLERINSELN (6 Tische à 6 Plätze) ===
  {
    id: "t1",
    label: "Tischinsel 1",
    shortLabel: "T1",
    x: 120,
    y: 160,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: [
      "6 Sitzplätze",
      "Stromanschluss vorhanden",
      "Oberfläche leicht zu reinigen, chemikalienbeständig",
    ],
  },
  {
    id: "t2",
    label: "Tischinsel 2",
    shortLabel: "T2",
    x: 120,
    y: 400,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: ["6 Sitzplätze", "Stromanschluss vorhanden"],
  },
  {
    id: "t3",
    label: "Tischinsel 3",
    shortLabel: "T3",
    x: 120,
    y: 640,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: ["6 Sitzplätze", "Stromanschluss vorhanden"],
  },
  {
    id: "t4",
    label: "Tischinsel 4",
    shortLabel: "T4",
    x: 370,
    y: 160,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: ["6 Sitzplätze", "Stromanschluss vorhanden"],
  },
  {
    id: "t5",
    label: "Tischinsel 5",
    shortLabel: "T5",
    x: 370,
    y: 400,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: ["6 Sitzplätze", "Stromanschluss vorhanden"],
  },
  {
    id: "t6",
    label: "Tischinsel 6",
    shortLabel: "T6",
    x: 370,
    y: 640,
    w: 180,
    h: 140,
    category: "arbeitsplaetze",
    icon: <Users className="h-5 w-5" />,
    description: "Schülerinsel für 6 Schüler",
    details: ["6 Sitzplätze", "Stromanschluss vorhanden"],
  },

  // === TAFEL / BEAMER (untere Kurzwand) ===
  {
    id: "tafel",
    label: "Digitale Tafel / Beamer",
    shortLabel: "Tafel",
    x: 290,
    y: 1235,
    w: 310,
    h: 45,
    category: "medien",
    icon: <Monitor className="h-5 w-5" />,
    description:
      "Interaktives Display (75–86 Zoll) oder Beamer an der Tafelwand",
    details: [
      "Interaktives Display oder Beamer mit Leinwand",
      "Separater Stromanschluss + Netzwerk",
      "Schiebetafel kann erhalten bleiben",
      "Wird von beiden Kursen genutzt",
    ],
  },

  // === DEMONSTRATIONSTISCH ===
  {
    id: "demotisch",
    label: "Demonstrationstisch",
    shortLabel: "Demo",
    x: 200,
    y: 1100,
    w: 350,
    h: 100,
    category: "labor",
    icon: <GraduationCap className="h-5 w-5" />,
    description:
      "Lehrerdemonstrationstisch vor der Tafel für Versuchsvorführungen",
    details: [
      "Chemikalienbeständige Oberfläche",
      "Stromanschluss, ggf. Gasanschluss",
      "Vorführung von Versuchen für die gesamte Klasse",
    ],
  },

  // === LEHRERTISCH ===
  {
    id: "lehrertisch",
    label: "Lehrertisch",
    shortLabel: "Lehrer",
    x: 660,
    y: 1140,
    w: 80,
    h: 130,
    category: "medien",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Lehrerarbeitsplatz in der Ecke nahe Laborzeile",
    details: ["Arbeitsplatz Lehrkraft", "In der Ecke neben der Tafelwand"],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function RaumplanPage() {
  const [selected, setSelected] = useState<Zone | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Raumplan Raum 168
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Mikrobiologielabor & Kunstraum · ca. 13 × 8 m ·
            Doppelnutzung mit Kunstkurs
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        {/* Category legend */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cat.bg} ${cat.text} ${cat.border} border`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    ZONE_FILLS[key as ZoneCategory].stroke,
                }}
              />
              {cat.label}
            </span>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* SVG Floor Plan — Hochformat: Breite=8m, Höhe=13m */}
          <Card className="overflow-hidden border-slate-800 shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div
                className="relative mx-auto w-full"
                style={{ maxWidth: 520, aspectRatio: "8 / 13" }}
              >
                <svg
                  viewBox="0 0 800 1300"
                  className="h-full w-full"
                  style={{ display: "block" }}
                >
                  {/* Background */}
                  <rect
                    x="0"
                    y="0"
                    width="800"
                    height="1300"
                    fill="#0f172a"
                    rx="6"
                  />

                  {/* Room outline */}
                  <rect
                    x="10"
                    y="10"
                    width="780"
                    height="1280"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3"
                    rx="4"
                  />

                  {/* Grid lines (subtle) */}
                  {[200, 400, 600].map((x) => (
                    <line
                      key={`vg${x}`}
                      x1={x}
                      y1={10}
                      x2={x}
                      y2={1290}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                  ))}
                  {[200, 400, 600, 800, 1000, 1200].map((y) => (
                    <line
                      key={`hg${y}`}
                      x1={10}
                      y1={y}
                      x2={790}
                      y2={y}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Room label */}
                  <text
                    x="400"
                    y="900"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1e293b"
                    fontSize="42"
                    fontWeight="700"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    RAUM 168
                  </text>

                  {/* Direction labels */}
                  <text
                    x="400"
                    y="1308"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    ▼ Kurzwand (unten) — Tafelseite · 8 m
                  </text>
                  <text
                    x="400"
                    y="7"
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    ▲ Kurzwand (oben) · 8 m
                  </text>
                  <text
                    x="797"
                    y="650"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                    transform="rotate(-90 797 650)"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    Fensterseite · 13 m →
                  </text>
                  <text
                    x="5"
                    y="650"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                    transform="rotate(90 5 650)"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    ← Türseite / Waschbecken · 13 m
                  </text>

                  {/* All zones */}
                  {ZONES.map((zone) => {
                    const isSelected = selected?.id === zone.id;
                    const isHovered = hoveredId === zone.id;
                    const colors = ZONE_FILLS[zone.category];
                    const isTable = zone.id.startsWith("t");
                    const fontSize = isTable
                      ? 16
                      : zone.w > 120 || zone.h > 200
                      ? 14
                      : 12;

                    return (
                      <g
                        key={zone.id}
                        onClick={() =>
                          setSelected((prev) =>
                            prev?.id === zone.id ? null : zone
                          )
                        }
                        onMouseEnter={() => setHoveredId(zone.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ cursor: "pointer" }}
                        role="button"
                        aria-label={zone.label}
                      >
                        <rect
                          x={zone.x}
                          y={zone.y}
                          width={zone.w}
                          height={zone.h}
                          fill={
                            isSelected || isHovered
                              ? colors.hoverFill
                              : colors.fill
                          }
                          stroke={
                            isSelected || isHovered
                              ? colors.stroke
                              : `${colors.stroke}66`
                          }
                          strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                          rx="6"
                          style={{ transition: "all 150ms ease" }}
                        />
                        {/* Label — nur bei ausreichend großen Zonen */}
                        {(zone.w >= 70 && zone.h >= 40) ||
                        (zone.h >= 200 && zone.w >= 50) ? (
                          zone.h > zone.w * 3 ? (
                            // Vertikaler Text für schmale, hohe Zonen
                            <text
                              x={zone.x + zone.w / 2}
                              y={zone.y + zone.h / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={colors.stroke}
                              fontSize={fontSize}
                              fontWeight="600"
                              transform={`rotate(-90 ${zone.x + zone.w / 2} ${zone.y + zone.h / 2})`}
                              style={{
                                userSelect: "none",
                                pointerEvents: "none",
                              }}
                            >
                              {zone.shortLabel || zone.label}
                            </text>
                          ) : (
                            <text
                              x={zone.x + zone.w / 2}
                              y={zone.y + zone.h / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={colors.stroke}
                              fontSize={fontSize}
                              fontWeight="600"
                              style={{
                                userSelect: "none",
                                pointerEvents: "none",
                              }}
                            >
                              {zone.shortLabel || zone.label}
                            </text>
                          )
                        ) : null}
                      </g>
                    );
                  })}

                  {/* Collie-Fahrweg (gestrichelt, zwischen Tischreihen) */}
                  <rect
                    x="310"
                    y="160"
                    width="50"
                    height="620"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="8 4"
                    rx="6"
                    opacity="0.35"
                  />
                  <text
                    x="335"
                    y="470"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="500"
                    transform="rotate(-90 335 470)"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    Collies (mobil)
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Detail Panel */}
          <div className="flex flex-col gap-4">
            {/* Selected zone details */}
            <Card className="border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-800 px-5 py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {selected ? "Zonendetails" : "Zone auswählen"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {selected ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${CATEGORIES[selected.category].bg} ${CATEGORIES[selected.category].text}`}
                        >
                          {selected.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100 leading-tight">
                            {selected.label}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`mt-1 text-xs ${CATEGORIES[selected.category].bg} ${CATEGORIES[selected.category].text} border-0`}
                          >
                            {CATEGORIES[selected.category].label}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {selected.description}
                    </p>

                    <div
                      className="h-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          ZONE_FILLS[selected.category].stroke + "30",
                      }}
                    />

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Details
                      </h4>
                      <ul className="space-y-2">
                        {selected.details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-300"
                          >
                            <span
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  ZONE_FILLS[selected.category].stroke,
                              }}
                            />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selected.equipment && selected.equipment.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Geräte & Ausstattung
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.equipment.map((eq) => (
                            <Badge
                              key={eq}
                              variant="outline"
                              className="text-xs font-normal text-slate-400 border-slate-800 bg-slate-950/50"
                            >
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                      <Microscope className="h-6 w-6 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-400">
                      Klicken Sie auf eine Zone im Raumplan, um Details
                      anzuzeigen.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Room stats */}
            <Card className="border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-800 px-5 py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Raumeckdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-100">~104</p>
                    <p className="text-xs text-slate-400">Quadratmeter</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">36</p>
                    <p className="text-xs text-slate-400">Schülerplätze</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">6</p>
                    <p className="text-xs text-slate-400">Tischinseln</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">13 m</p>
                    <p className="text-xs text-slate-400">Laborzeile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile units info */}
            <Card className="border-dashed border-slate-700 bg-slate-950/50 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800">
                    <Zap className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">
                      Mobile Collies
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                      Fahrbare Einheiten mit Gasanschlüssen, flexibel an
                      Tischinseln einsetzbar. Ersetzen feste Gasanschlüsse.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick overview */}
            <Card className="border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-800 px-5 py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Alle Zonen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800">
                  {ZONES.filter(
                    (z) => !z.id.startsWith("t") || z.id === "t1"
                  ).map((zone) => {
                    const colors = ZONE_FILLS[zone.category];
                    const isTable = zone.id === "t1";
                    const isActive =
                      selected?.id === zone.id ||
                      (isTable && selected?.id.startsWith("t"));

                    return (
                      <button
                        key={zone.id}
                        onClick={() =>
                          setSelected((prev) =>
                            prev?.id === zone.id ? null : zone
                          )
                        }
                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-800 ${
                          isActive ? "bg-slate-800" : ""
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: colors.stroke }}
                        />
                        <span className="flex-1 text-sm text-slate-300">
                          {isTable ? "Schülerinseln (6×)" : zone.label}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORIES[zone.category].bg} ${CATEGORIES[zone.category].text}`}
                        >
                          {CATEGORIES[zone.category].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Doppelnutzung info */}
        <Card className="mt-6 border-amber-800 bg-gradient-to-r from-amber-950/30 to-orange-950/30 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-900/40">
                <Palette className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-300">
                  Doppelnutzung mit Kunstkurs
                </h3>
                <p className="mt-1 text-sm text-amber-300 leading-relaxed">
                  Der Raum wird gemeinsam mit dem Kunstkurs genutzt. Die
                  Laborzeile (Fensterseite) ist während des Kunstunterrichts
                  gesperrt. Alle Unterschränke sind abschließbar. Ein
                  Reinigungsprotokoll zwischen den Kursen ist vorgesehen.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="border-amber-800 bg-amber-900/40 text-amber-300 hover:bg-amber-900/40">
                    Abschließbare Schränke
                  </Badge>
                  <Badge className="border-amber-800 bg-amber-900/40 text-amber-300 hover:bg-amber-900/40">
                    Zugangsregeln
                  </Badge>
                  <Badge className="border-amber-800 bg-amber-900/40 text-amber-300 hover:bg-amber-900/40">
                    Reinigungsprotokoll
                  </Badge>
                  <Badge className="border-amber-800 bg-amber-900/40 text-amber-300 hover:bg-amber-900/40">
                    Getrennte Entsorgung
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
