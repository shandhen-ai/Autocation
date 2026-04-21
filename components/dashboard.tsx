'use client'

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, ArrowRight, PlusCircle, FileText, Settings, HelpCircle, Bell,
  ChevronRight, TrendingUp, DollarSign, Shield, Truck,
  Check, BarChart2, LayoutDashboard,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  getTotalSavings, getSavingsByCategory, getRecentReports,
} from "@/lib/mock-data"
import { DEMO_USER } from "@/lib/mock-data/users"

// ─── Design tokens (preserved from original) ───────────────────────

const CARD_SHADOW =
  "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px"

const C = {
  teal: "oklch(0.78 0.16 182)",
  tealMuted: "oklch(0.78 0.16 182 / 0.3)",
  azure: "oklch(0.68 0.14 245)",
  amber: "oklch(0.76 0.14 75)",
  rose: "oklch(0.62 0.22 18)",
  slate: "oklch(0.50 0.02 260)",
  gain: "oklch(0.76 0.16 162)",
  loss: "oklch(0.62 0.22 18)",
  grid: "oklch(0.24 0.01 260)",
  tick: "oklch(0.50 0.015 260)",
  surface: "oklch(0.175 0.01 260)",
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// ─── Mock data ─────────────────────────────────────────────────────

const recentReports = getRecentReports(3)
const totalSavings = getTotalSavings()
const savingsByCategory = getSavingsByCategory()
const greetingName = DEMO_USER.name
const benchmarkUpdated = "2 days ago"
const reportCount = recentReports.length

// ─── Sub-components ───────────────────────────────────────────────

function GlowOrb({ className }: { className?: string }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

function SavingsBarChart({ data }: { data: typeof savingsByCategory }) {
  const chartData = data.map(d => ({ name: d.category, amount: d.amount }))
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: C.tick }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: C.tick }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="rounded-xl surface-elevated p-3 text-xs backdrop-blur-md shadow-lg">
                <p className="text-muted-foreground mb-1 font-semibold text-[11px] uppercase tracking-wider font-sans">{label}</p>
                <p className="font-mono font-bold text-foreground text-sm">
                  ${payload[0].value?.toLocaleString()}
                </p>
              </div>
            )
          }}
        />
        {data.map((entry) => (
          <Bar key={entry.category} dataKey="amount" fill={entry.color} radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Recent Report Card ────────────────────────────────────────────

function RecentReportCard({ report, delay = 0 }: {
  report: ReturnType<typeof getRecentReports>[0]
  delay?: number
}) {
  const router = useRouter()
  const { vehicle, totalSavings: savings, reportDate, confidence } = report

  return (
    <motion.button
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      onClick={() => router.push(`/reports/${report.id}`)}
      className="w-full text-left rounded-2xl surface-card p-5 hover:scale-[1.01] transition-all duration-300 group"
      style={{ boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
            <Car className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground font-sans">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </p>
            <p className="text-[11px] text-muted-foreground font-sans">{reportDate}</p>
          </div>
        </div>
        <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors mt-1 shrink-0" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground font-sans mb-1">Total Savings Found</p>
          <p className="text-xl font-bold font-mono text-fin-gain">
            ${savings.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground font-sans mb-1">Confidence</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono px-2 py-1 rounded-lg bg-fin-gain/10 text-fin-gain">
            <Check className="size-3" />{confidence}%
          </span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Activity Feed ─────────────────────────────────────────────────

function ActivityFeed() {
  const items = [
    {
      icon: FileText,
      text: `Your ${recentReports[0]?.vehicle.make} ${recentReports[0]?.vehicle.model} report was generated on ${recentReports[0]?.reportDate}`,
      time: "1 day ago",
    },
    {
      icon: TrendingUp,
      text: "KBB benchmarks updated " + benchmarkUpdated,
      time: benchmarkUpdated,
    },
    {
      icon: Bell,
      text: `${reportCount} report${reportCount !== 1 ? "s" : ""} awaiting review`,
      time: "3 days ago",
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE_OUT }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30"
          >
            <div className="size-8 rounded-lg bg-accent/40 flex items-center justify-center shrink-0">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground font-sans leading-relaxed">{item.text}</p>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.time}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────

function Sidebar({ activePage, onNav }: {
  activePage: string
  onNav: (page: string) => void
}) {
  const { email, logout } = useAuth()
  const router = useRouter()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyze", label: "New Analysis", icon: PlusCircle },
    { id: "history", label: "Report History", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="w-60 min-h-screen surface-card border-r border-border/60 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/12 flex items-center justify-center glow-teal-sm">
            <MapPin className="size-4 text-primary" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-foreground font-display">Autocation</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activePage
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-semibold font-sans transition-colors duration-200 ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="dashboard-sidebar-active-pill"
                  className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/12 shadow-[0_12px_30px_-22px_oklch(0.78_0.16_182_/_0.9)]"
                  transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
                />
              ) : null}
              <span className="absolute inset-0 rounded-xl transition-colors duration-200 hover:bg-accent/40" />
              <span className="relative z-10 flex items-center gap-3">
                <Icon className={`size-4 shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : ""}`} />
                <span>{item.label}</span>
              </span>
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0 glow-teal-sm">
            <span className="text-xs font-bold text-primary font-display">
              {greetingName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground font-sans truncate">{greetingName}</p>
            <p className="text-[10px] text-muted-foreground font-sans truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors font-sans px-2"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────

function StatCard({ label, value, sublabel, icon: Icon, delay = 0 }: {
  label: string
  value: string
  sublabel?: string
  icon: React.ElementType
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-2xl surface-card p-5"
      style={{ boxShadow: CARD_SHADOW }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none">
        {Icon && <Icon className="size-24 -translate-y-4 translate-x-4" />}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-4 text-primary" />
        </div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground font-sans">{label}</p>
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono tracking-tighter leading-none">
        {value}
      </p>
      {sublabel && (
        <p className="text-[11px] text-muted-foreground font-sans mt-2">{sublabel}</p>
      )}
    </motion.div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────

export default function AutolocationDashboard() {
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const activePage = "dashboard"

  const handleNav = useCallback((page: string) => {
    setMobileSidebarOpen(false)
    if (page === "analyze") {
      router.push("/analyze/new")
    } else if (page === "history") {
      router.push("/reports")
    } else if (page === "settings") {
      router.push("/settings")
    } else if (page === "help") {
      router.push("/help")
    } else if (page === "dashboard") {
      router.push("/dashboard")
    }
  }, [router])

  // Demo: demo account is logged in
  const greetingName = DEMO_USER.name

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px] animate-float" style={{ background: C.teal }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px] animate-float" style={{ background: C.azure, animationDelay: "3s" }} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:block relative z-10">
        <Sidebar activePage={activePage} onNav={handleNav} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar activePage={activePage} onNav={handleNav} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 relative z-10 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden border-b border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 z-30 px-4 h-14 flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent/50">
            <BarChart2 className="size-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/12 flex items-center justify-center">
              <MapPin className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-extrabold text-foreground">Autocation</span>
          </div>
        </header>

        {/* Page content */}
        <AnimatePresence mode="wait">
          {activePage === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="p-6 lg:p-10"
            >
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="mb-8"
              >
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-display tracking-tight">
                  Welcome back, {greetingName} 👋
                </h1>
                <p className="text-sm text-muted-foreground font-sans mt-1">
                  Here's an overview of your saved reports and savings.
                </p>
              </motion.div>

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
                className="mb-8 rounded-2xl surface-card p-6 relative overflow-hidden cursor-pointer group"
                style={{ boxShadow: CARD_SHADOW }}
                onClick={() => router.push("/analyze/new")}
              >
                <GlowOrb className="w-48 h-48 -top-24 -right-24 bg-primary/8" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-lg font-bold text-foreground font-display mb-1">
                      Analyze a new vehicle contract →
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans">
                      Upload your documents and get a savings report in 60 seconds.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[FileText, Shield, Truck, DollarSign].map((Icon, i) => (
                        <div key={i} className="size-9 rounded-xl bg-card border border-border/50 flex items-center justify-center">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    <ArrowRight className="size-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard
                  label="Total Savings Found"
                  value={`$${totalSavings.toLocaleString()}`}
                  sublabel={`across ${reportCount} reports`}
                  icon={DollarSign}
                  delay={0}
                />
                <StatCard
                  label="Avg. Confidence"
                  value={`${Math.round(recentReports.reduce((s, r) => s + r.confidence, 0) / recentReports.length)}%`}
                  sublabel="Across all analyses"
                  icon={Shield}
                  delay={0.06}
                />
                <StatCard
                  label="Reports Analyzed"
                  value={String(reportCount)}
                  sublabel="Vehicle contracts reviewed"
                  icon={FileText}
                  delay={0.12}
                />
              </div>

              {/* Charts + Activity row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                {/* Category chart — spans 2 cols */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
                  className="lg:col-span-2 rounded-2xl surface-card p-5 lg:p-6"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-foreground tracking-tight font-display">
                        Savings by Category
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">
                        Aggregated across all {reportCount} reports
                      </p>
                    </div>
                  </div>
                  <SavingsBarChart data={savingsByCategory} />
                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                    {savingsByCategory.map((item) => (
                      <div key={item.category} className="flex items-center gap-2 text-xs">
                        <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground font-sans">{item.category}</span>
                        <span className="font-mono font-bold text-foreground">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Activity feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
                  className="rounded-2xl surface-card p-5 lg:p-6"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <h3 className="text-sm font-bold text-foreground tracking-tight font-display mb-4">
                    Activity Feed
                  </h3>
                  <ActivityFeed />
                </motion.div>
              </div>

              {/* Recent Reports */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT }}
                className="rounded-2xl surface-card p-5 lg:p-6"
                style={{ boxShadow: CARD_SHADOW }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight font-display">
                      Recent Reports
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">
                      Your latest vehicle analyses
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/reports")}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors font-sans"
                  >
                    View all <ChevronRight className="size-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentReports.map((report, i) => (
                    <RecentReportCard key={report.id} report={report} delay={0.1 + i * 0.08} />
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <footer className="mt-12 pt-6 border-t border-border/40">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-fin-gain animate-pulse-soft" />
                    <span className="font-medium">All systems operational</span>
                  </div>
                  <span className="font-mono text-muted-foreground/60">
                    Last updated: Jun 20, 2026 — 14:32 UTC
                  </span>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Mini car icon helper
function Car({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}
