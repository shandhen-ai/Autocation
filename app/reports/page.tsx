'use client'

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText, ArrowRight, CheckCircle, Clock, DollarSign,
  Shield, Car,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/hooks/use-auth"
import { REPORTS } from "@/lib/mock-data"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

function VehicleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

export default function ReportsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

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
              Report History
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground font-display justify-self-center">
              Your Vehicle Analyses
            </h1>
            <div className="hidden lg:block" />
          </div>
        </PageHeader>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="rounded-2xl surface-card p-5"
                style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-sans">Total Reports</p>
                </div>
                <p className="text-2xl font-bold font-mono text-foreground">{REPORTS.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
                className="rounded-2xl surface-card p-5"
                style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-fin-gain/10 flex items-center justify-center">
                    <DollarSign className="size-4 text-fin-gain" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-sans">Total Savings</p>
                </div>
                <p className="text-2xl font-bold font-mono text-fin-gain">
                  ${REPORTS.reduce((s, r) => s + r.totalSavings, 0).toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
                className="rounded-2xl surface-card p-5"
                style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="size-4 text-primary" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-sans">Avg. Confidence</p>
                </div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {Math.round(REPORTS.reduce((s, r) => s + r.confidence, 0) / REPORTS.length)}%
                </p>
              </motion.div>
            </div>

            {/* Reports table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
              className="rounded-2xl surface-card overflow-hidden"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="p-5 lg:p-6 border-b border-border/50">
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">All Reports</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">Complete analysis history</p>
              </div>

              <div className="divide-y divide-border/30">
                {REPORTS.map((report, i) => {
                  const { vehicle, totalSavings, reportDate, confidence, status } = report
                  return (
                    <motion.button
                      key={report.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 + i * 0.06, ease: EASE_OUT }}
                      onClick={() => router.push(`/reports/${report.id}`)}
                      className="w-full flex items-center gap-4 p-4 lg:p-5 text-left hover:bg-accent/20 transition-all duration-200 group"
                    >
                      <div className="size-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                        <VehicleIcon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground font-sans">
                          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-muted-foreground font-mono">{reportDate}</span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md font-sans ${
                            status === "complete" ? "bg-fin-gain/10 text-fin-gain" : "bg-chart-3/10 text-chart-3"
                          }`}>
                            {status === "complete" ? <CheckCircle className="size-2.5" /> : <Clock className="size-2.5" />}
                            {status === "complete" ? "Complete" : "Processing"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold font-mono text-fin-gain">${totalSavings.toLocaleString()}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <Shield className="size-2.5 text-muted-foreground" />
                          <span className="text-[10px] font-mono text-muted-foreground">{confidence}% confidence</span>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
