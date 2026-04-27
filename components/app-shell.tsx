'use client'

import { AutocationLogo } from "@/components/autocation-logo"
import { ChatWidget } from "@/components/chat-widget"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_USER } from "@/lib/mock-data/users"
import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart2, ChevronLeft, ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard, LogOut, PlusCircle,
  Settings,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useCallback, useState } from "react"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { email, logout } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        className={`relative flex w-full items-center overflow-hidden rounded-xl py-2.5 text-left text-sm font-semibold font-sans transition-colors duration-200 ${sidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"
          } ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
      >
        {isActive ? (
          <motion.span
            layoutId="sidebar-active-pill"
            className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/12 shadow-[0_12px_30px_-22px_oklch(0.72_0.15_82_/_0.9)]"
            transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
            style={{ right: 'auto' }}
          />
        ) : null}
        <span className="absolute inset-0 rounded-xl transition-colors duration-200 hover:bg-accent/40" />
        <span className={`relative z-10 flex items-center ${sidebarCollapsed ? "justify-center" : ""}`}>
          <Icon className={`size-4 shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : ""}`} />
          <motion.span
            initial={false}
            animate={{
              maxWidth: sidebarCollapsed ? 0 : 148,
              opacity: sidebarCollapsed ? 0 : 1,
              marginLeft: sidebarCollapsed ? 0 : 12,
            }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="block overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        </span>
      </button>
    )
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px] animate-float"
          style={{ background: "oklch(0.72 0.15 82)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px] animate-float"
          style={{ background: "oklch(0.68 0.14 245)", animationDelay: "3s" }}
        />
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex h-screen shrink-0 relative z-20 overflow-visible">
        <AnimatePresence initial={false}>
          <motion.div
            initial={false}
            animate={{ width: sidebarCollapsed ? 72 : 240 }}
            transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
            className="relative h-screen max-h-screen overflow-visible"
          >
            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="absolute -right-4 top-1/2 z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-primary text-primary-foreground shadow-[0_14px_34px_-18px_oklch(0.72_0.15_82_/_0.95)] transition-colors hover:bg-primary/80"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4 text-primary-foreground" />
              ) : (
                <ChevronLeft className="size-4 text-primary-foreground" />
              )}
            </button>

            <div className="flex h-full flex-col overflow-hidden surface-card border-r border-border/60">
              {/* Logo */}
              <div className="flex h-24 shrink-0 items-center justify-center border-b border-border/40 px-5">
                <AnimatePresence mode="wait" initial={false}>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <AutocationLogo className="w-[172px]" />
                    </motion.div>
                  )}
                  {sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <AutocationLogo className="w-[48px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-3 flex flex-col gap-1 overflow-hidden">
                {navItems.map(renderNavButton)}
              </nav>

              {/* User */}
              <div className="shrink-0 border-t border-border/40 px-4 py-4">
                <AnimatePresence mode="wait" initial={false}>
                  {!sidebarCollapsed ? (
                    <motion.div
                      key="user-expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0 glow-gold-sm">
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
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground font-sans"
                      >
                        <LogOut className="size-3.5" />
                        Sign out
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="user-collapsed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-center"
                    >
                      <button
                        onClick={handleLogout}
                        aria-label="Sign out"
                        className="size-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0 glow-gold-sm transition-colors hover:bg-primary/18"
                      >
                        <LogOut className="size-4 text-primary" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative z-10 w-60 h-screen surface-card border-r border-border/60 flex flex-col shrink-0">
            <div className="p-5 border-b border-border/40 flex items-center justify-between shrink-0">
              <div className="flex-1 flex justify-center">
                <AutocationLogo className="w-[152px]" />
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-hidden">
              {navItems.map(renderNavButton)}
            </nav>
            <div className="p-4 border-t border-border/40 shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary font-display">{greetingName.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground font-sans truncate">{greetingName}</p>
                  <p className="text-[10px] text-muted-foreground font-sans truncate">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground font-sans"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden relative border-b border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 z-30 px-4 h-14 flex items-center shrink-0">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent/50">
            <BarChart2 className="size-5 text-muted-foreground" />
          </button>
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <AutocationLogo className="w-[132px]" />
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      <ChatWidget />
    </div>
  )
}