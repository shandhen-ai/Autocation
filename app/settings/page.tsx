'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Bell, Link2, CreditCard, Shield, ChevronRight } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_USER } from "@/lib/mock-data"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, email } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    reportReady: true,
    savingsAlert: true,
    weeklyDigest: false,
    marketing: false,
  })

  useEffect(() => {
    if (!isAuthenticated) router.replace("/")
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        <PageHeader className="py-4">
          <div className="grid w-full gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="text-xs text-muted-foreground font-sans lg:justify-self-start">
              Account
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground font-display justify-self-center">
              Settings
            </h1>
            <div className="hidden lg:block" />
          </div>
        </PageHeader>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Profile</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div>
                    <p className="text-xs font-semibold text-foreground font-sans">Full Name</p>
                    <p className="text-[11px] text-muted-foreground font-sans">Display name on reports</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{DEMO_USER.name}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground font-sans">Email</p>
                    <p className="text-[11px] text-muted-foreground font-sans">Used for account and reports</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{email ?? DEMO_USER.email}</span>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { key: "reportReady", label: "Report ready", desc: "When your analysis completes" },
                  { key: "savingsAlert", label: "Savings alerts", desc: "New savings opportunities found" },
                  { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of your vehicle activity" },
                  { key: "marketing", label: "Marketing", desc: "Tips and product updates" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-xs font-semibold text-foreground font-sans">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground font-sans">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Connected accounts */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Link2 className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Connected Accounts</h2>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Google", connected: true, plan: "lee@auto-cation.com" },
                  { name: "Kelley Blue Book", connected: false },
                  { name: "Credit Karma", connected: false },
                ].map((acc) => (
                  <div key={acc.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted/40 flex items-center justify-center">
                        <Link2 className="size-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground font-sans">{acc.name}</p>
                        {acc.plan && <p className="text-[10px] text-muted-foreground font-mono">{acc.plan}</p>}
                        {!acc.connected && <p className="text-[10px] text-muted-foreground font-sans">Not connected</p>}
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-primary font-sans">
                      {acc.connected ? "Disconnect" : "Connect"}
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Billing */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Billing & Plan</h2>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/8 border border-primary/20 mb-3">
                <div>
                  <p className="text-xs font-bold text-foreground font-sans">Free Trial</p>
                  <p className="text-[10px] text-muted-foreground font-sans">3 reports remaining this month</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-primary/15 text-primary font-sans">Active</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/20">
                <Shield className="size-3.5 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground font-sans">
                  Upgrade to Pro for unlimited reports, AI chat, and PDF exports. Coming soon.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Support & Help</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => router.push("/help")}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground font-sans">Open help center</p>
                    <p className="text-[11px] text-muted-foreground font-sans">FAQ, support, and next steps</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => window.open("mailto:support@autocation.com", "_self")}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground font-sans">Email support</p>
                    <p className="text-[11px] text-muted-foreground font-sans">support@autocation.com</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  toast({
                    title: "Preferences saved",
                    description: "Your notification and account settings were updated.",
                  })
                }
                className="inline-flex items-center rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary/15"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
