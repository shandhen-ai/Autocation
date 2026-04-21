'use client'

import React, { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard, PlusCircle, FileText, Settings, HelpCircle,
  BarChart2,
} from "lucide-react"
import { AutocationLogo } from "@/components/autocation-logo"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_USER } from "@/lib/mock-data/users"
import { ChatWidget } from "@/components/chat-widget"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { email, logout } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const greetingName = DEMO_USER.name

  // Determine active page from pathname
  const getActivePage = () => {
    if (pathname === "/" || pathname === "/dashboard") return "dashboard"
    if (pathname.startsWith("/analyze")) return "analyze"
    if (pathname.startsWith("/reports")) return "history"
    if (pathname === "/settings") return "settings"
    if (pathname === "/help") return "help"
    return "dashboard"
  }

  const activePage = getActivePage()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyze", label: "New Analysis", icon: PlusCircle },
    { id: "history", label: "Report History", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ]

  const handleNav = useCallback((page: string) => {
    setMobileSidebarOpen(false)
    if (page === "analyze") {
      router.push("/analyze/new")
    } else if (page === "history") {
      router.push("/reports")
    } else if (page === "dashboard") {
      router.push("/dashboard")
    } else if (page === "settings") {
      router.push("/settings")
    } else if (page === "help") {
      router.push("/help")
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const renderNavButton = (item: typeof navItems[number]) => {
    const Icon = item.icon
    const isActive = item.id === activePage

    return (
      <button
        key={item.id}
        onClick={() => handleNav(item.id)}
        className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-semibold font-sans transition-colors duration-200 ${
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isActive ? (
          <motion.span
            layoutId="sidebar-active-pill"
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
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px] animate-float"
          style={{ background: "oklch(0.78 0.16 182)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px] animate-float"
          style={{ background: "oklch(0.68 0.14 245)", animationDelay: "3s" }}
        />
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen surface-card border-r border-border/60 flex-col shrink-0 relative z-10">
        {/* Logo */}
        <div className="flex justify-center p-5 border-b border-border/40">
          <AutocationLogo className="w-[172px]" />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(renderNavButton)}
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

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative z-10 w-60 min-h-screen surface-card border-r border-border/60 flex flex-col shrink-0">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <div className="flex-1 flex justify-center">
                <AutocationLogo className="w-[152px]" />
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1">
              {navItems.map(renderNavButton)}
            </nav>
            <div className="p-4 border-t border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary font-display">{greetingName.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground font-sans truncate">{greetingName}</p>
                  <p className="text-[10px] text-muted-foreground font-sans truncate">{email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors font-sans px-2">Sign out</button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 relative z-10 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden relative border-b border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 z-30 px-4 h-14 flex items-center">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent/50">
            <BarChart2 className="size-5 text-muted-foreground" />
          </button>
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <AutocationLogo className="w-[132px]" />
          </div>
        </header>

        {children}
      </main>
      <ChatWidget />
    </div>
  )
}
