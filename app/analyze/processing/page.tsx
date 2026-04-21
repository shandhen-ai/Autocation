'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/hooks/use-auth"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const STAGES = [
  { id: "securing", label: "Securing your documents...", duration: 1000 },
  { id: "ocr", label: "Running OCR extraction...", duration: 2000 },
  { id: "identifying", label: "Identifying clauses and financial terms...", duration: 2000 },
  { id: "crossref", label: "Cross-referencing KBB and Black Book benchmarks...", duration: 2000 },
  { id: "calculating", label: "Calculating savings opportunities...", duration: 2000 },
  { id: "generating", label: "Generating your report...", duration: 1000 },
]

const REASSURANCE_MESSAGES = [
  "This usually takes 60 seconds...",
  "Analyzing 247 data points...",
  "Almost there...",
]

const STAGE_CHIPS: Record<string, string[]> = {
  ocr: ["APR found", "Loan term found", "Dealer markup found", "Warranty detected"],
  identifying: ["Finance rate: 8.9%", "Extended warranty: Fidelity National", "Trade-in value found"],
  crossref: ["KBB benchmark loaded", "Black Book data matched", "Fed H.15 rates applied"],
  calculating: ["Financing savings calculated", "Warranty savings calculated", "Trade-in differential computed"],
}

function ProcessingStage({ stage, completed, active }: {
  stage: typeof STAGES[0]
  completed: boolean
  active: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex items-center gap-3 py-2"
    >
      <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${
        completed ? "bg-fin-gain/15" : active ? "bg-primary/15" : "bg-muted/30"
      }`}>
        {completed ? (
          <Check className="size-3.5 text-fin-gain" />
        ) : active ? (
          <Loader2 className="size-3.5 text-primary animate-spin" />
        ) : (
          <div className="size-2 rounded-full bg-muted/50" />
        )}
      </div>
      <span className={`text-sm font-sans ${
        completed ? "text-foreground" : active ? "text-foreground font-semibold" : "text-muted-foreground"
      }`}>
        {stage.label}
      </span>
    </motion.div>
  )
}

function ProcessingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const skip = searchParams.get("skip") === "true"
  const { isAuthenticated } = useAuth()

  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set())
  const [confidencePct, setConfidencePct] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [chips, setChips] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/"); return }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (skip) {
      router.replace("/analyze/output")
      return
    }

    let stageIndex = 0
    const interval = setInterval(() => {
      const stage = STAGES[stageIndex]
      setCurrentStage(stageIndex)

      // Add chips for this stage
      if (STAGE_CHIPS[stage.id]) {
        setChips(prev => [...prev, ...STAGE_CHIPS[stage.id]])
      }

      // Advance after stage duration
      setTimeout(() => {
        setCompletedStages(prev => new Set([...prev, stageIndex]))
        setConfidencePct(Math.round(((stageIndex + 1) / STAGES.length) * 100))
        stageIndex++

        if (stageIndex >= STAGES.length) {
          clearInterval(interval)
          setTimeout(() => {
            router.replace("/analyze/output")
          }, 500)
        }
      }, stage.duration)

    }, 800)

    // Rotate reassurance messages
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % REASSURANCE_MESSAGES.length)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(msgInterval)
    }
  }, [skip, router])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Animated document */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            {/* Scan line animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              animate={currentStage < STAGES.length ? {
                boxShadow: ["inset 0 0 0 2px oklch(0.78 0.16 182 / 0.1)", "inset 0 0 0 2px oklch(0.78 0.16 182 / 0.4)", "inset 0 0 0 2px oklch(0.78 0.16 182 / 0.1)"],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Document card */}
            <div className="w-40 h-52 rounded-2xl surface-card border border-border/40 flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-28 rounded-lg bg-muted/40 flex flex-col gap-1.5 p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-muted/60" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
                <div className="h-1.5 rounded-full bg-primary/30 mt-1" style={{ width: "80%" }} />
                <div className="h-1.5 rounded-full bg-muted/60" style={{ width: "70%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">contract.pdf</p>
            </div>
          </div>
        </motion.div>

        {/* Stages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT }}
          className="space-y-1 mb-8"
        >
          {STAGES.map((stage, i) => (
            <ProcessingStage
              key={stage.id}
              stage={stage}
              completed={completedStages.has(i)}
              active={i === currentStage}
            />
          ))}
        </motion.div>

        {/* Chips */}
        {chips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {chips.map((chip, i) => (
              <motion.span
                key={`${chip}-${i}`}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-sans"
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Confidence meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-sans">Analysis confidence</span>
            <span className="text-xs font-mono font-bold text-primary">{confidencePct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${confidencePct}%` }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            />
          </div>
        </div>

        {/* Reassurance */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="text-center text-xs text-muted-foreground font-sans"
          >
            {REASSURANCE_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}>
      <AppShell>
        <ProcessingContent />
      </AppShell>
    </Suspense>
  )
}
