'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle, MessageSquare, ArrowRight, X,
  DollarSign, Shield, Car, AlertTriangle,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { getReportById } from "@/lib/mock-data"
import { useAuth } from "@/hooks/use-auth"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const DEMO_REPORT_ID = "demo-report-1"

// ─── Chat panel ────────────────────────────────────────────────────────────────

const CHAT_RESPONSES: Record<string, string[]> = {
  refinance: [
    "Based on your 8.9% APR, refinancing with a credit union could save you $2,127/year. Typical refinance rates for your credit tier are 5.9%–6.4%.",
    "Credit unions like Navy Federal or local CUs often offer the best auto refinance rates. I'd recommend getting quotes from at least 3 lenders.",
  ],
  warranty: [
    "Your Fidelity National warranty was priced at $3,200 — a third-party equivalent runs about $1,780. You have a 30-day cancellation window from contract signing.",
    "Cancellation tip: Send a written request via certified mail to Fidelity National. Keep a copy for your records. Refunds typically process within 2–3 weeks.",
  ],
  trade: [
    "Your trade-in was undervalued by $300–$1,400. KBB shows $13,100–$14,200 for your 2018 Camry, but the dealer offered $12,800.",
    "Pro tip: Use the Manheim auction average ($13,900) as a data point when negotiating. Dealers know you can sell it yourself for that.",
  ],
  apr: [
    "Your APR is 8.9%. For reference, the current Fed H.15 average for 60-month new car loans is 6.4%. The 2.5% spread represents dealer markup.",
    "The dealer markup on your buy rate was detected at $1,200. This is common — dealers can mark up the rate they offer you and keep the difference.",
  ],
  accuracy: [
    "This analysis is 94% confident based on 6 data points extracted from your documents. The confidence score reflects how many benchmarks we could cross-reference.",
    "We cross-reference your data against KBB, Black Book, Fed H.15, Manheim auction data, and our warranty database. Gaps in uploaded documents lower confidence.",
  ],
  markup: [
    "A dealer markup of $1,200 over buy rate was detected. This means the dealer financed you at a higher rate than they qualified for, keeping the difference.",
    "To recover this: refinance with a new lender within 30–60 days of original contract signing. Some states limit how much dealers can markup.",
  ],
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ from: "ai" | "user"; text: string }[]>([
    { from: "ai", text: "Great analysis complete! Ask me anything about your savings opportunities." }
  ])
  const [input, setInput] = useState("")
  const [replyIndex, setReplyIndex] = useState<Record<string, number>>({})

  const sendMessage = (text: string) => {
    setMessages(prev => [...prev, { from: "user", text }])
    const lower = text.toLowerCase()
    const match = Object.entries(CHAT_RESPONSES).find(([key]) => lower.includes(key))
    const key = match?.[0] ?? "accuracy"
    const responses = CHAT_RESPONSES[key]
    const idx = (replyIndex[key] ?? 0) % responses.length
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "ai", text: responses[idx] }])
      setReplyIndex(prev => ({ ...prev, [key]: idx + 1 }))
    }, 600)
    setInput("")
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="fixed inset-y-0 right-0 w-full sm:w-96 surface-card border-l border-border/60 flex flex-col z-50"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/12 flex items-center justify-center">
            <MessageSquare className="size-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground font-display">Report Assistant</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.from === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans ${
              msg.from === "ai"
                ? "bg-primary/10 text-foreground border border-primary/20"
                : "bg-primary text-primary-foreground"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && input.trim() && sendMessage(input.trim())}
            placeholder="Ask about this report..."
            className="flex-1 bg-muted/30 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-sans"
          />
          <button
            onClick={() => input.trim() && sendMessage(input.trim())}
            disabled={!input.trim()}
            className="size-8 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const dur = 1500
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])
  return <>{prefix}{display.toLocaleString()}</>
}

export default function AnalyzeOutputPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.replace("/")
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const report = getReportById(DEMO_REPORT_ID)
  if (!report) {
    router.replace("/dashboard")
    return null
  }

  const { vehicle, totalSavings, confidence, categories } = report

  const financingCat = categories.find(c => c.id === "financing")
  const warrantyCat = categories.find(c => c.id === "warranty")
  const tradeinCat = categories.find(c => c.id === "tradein")
  const insuranceCat = categories.find(c => c.id === "insurance")

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        {/* Page header */}
        <div className="border-b border-border/60 bg-card/40 backdrop-blur-xl px-6 lg:px-10 py-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-1">
            <span>New Vehicle Analysis</span>
            <span>›</span>
            <span className="text-foreground font-semibold">Results</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-display tracking-tight">
            Your Analysis is Ready
          </h1>
        </div>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="size-12 rounded-full bg-fin-gain/15 flex items-center justify-center"
              >
                <CheckCircle className="size-6 text-fin-gain" />
              </motion.div>
              <div>
                <p className="text-base font-bold text-foreground font-display">Analysis Complete</p>
                <p className="text-xs text-muted-foreground font-sans">Your full savings report is ready to view</p>
              </div>
            </motion.div>

            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
              className="rounded-2xl surface-card overflow-hidden"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px" }}
            >
              {/* Savings banner */}
              <div className="bg-primary/8 border-b border-primary/20 px-6 py-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="size-64 rounded-full opacity-10 blur-[80px]" style={{ background: "oklch(0.78 0.16 182)" }} />
                </div>
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80 font-sans mb-3">Estimated Savings Found</p>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl lg:text-6xl font-extrabold font-mono text-primary">
                      $<AnimatedNumber value={totalSavings} />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="size-3 text-muted-foreground" />
                      <span className="text-xs font-mono text-muted-foreground">{confidence}% confidence</span>
                    </div>
                    <div className="w-px h-3 bg-border/40" />
                    <span className="text-xs font-mono text-muted-foreground">{report.reportDate}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle details */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                    <Car className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground font-sans">
                      {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">{vehicle.vin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Purchase Price", value: `$${vehicle.purchasePrice.toLocaleString()}` },
                    { label: "KBB Value", value: `$${vehicle.kbbValue.toLocaleString()}` },
                    { label: "Black Book", value: `$${vehicle.blackBookValue.toLocaleString()}` },
                    { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} mi` },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/20 border border-border/20">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-sans mb-1">{item.label}</p>
                      <p className="text-sm font-bold font-mono text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/reports/${DEMO_REPORT_ID}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors font-sans"
                >
                  View Full Report
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.div>

            {/* Key findings */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans mb-3">Key Findings</p>
              <div className="space-y-2">
                {[
                  financingCat?.amount && {
                    icon: DollarSign,
                    label: "Financing",
                    text: `APR overcharge detected — save $${financingCat.amount.toLocaleString()}/yr`,
                    color: "text-fin-gain",
                    bg: "bg-fin-gain/10",
                    border: "border-fin-gain/20",
                  },
                  warrantyCat?.amount && {
                    icon: Shield,
                    label: "Warranty",
                    text: `Overpriced by $${warrantyCat.amount.toLocaleString()} — third-party options available`,
                    color: "text-chart-3",
                    bg: "bg-chart-3/10",
                    border: "border-chart-3/20",
                  },
                  tradeinCat?.amount && {
                    icon: AlertTriangle,
                    label: "Trade-in",
                    text: `Undervalued by $${tradeinCat.amount.toLocaleString()}–$${tradeinCat.amountMax?.toLocaleString()}`,
                    color: "text-chart-2",
                    bg: "bg-chart-2/10",
                    border: "border-chart-2/20",
                  },
                  {
                    icon: Shield,
                    label: "Insurance",
                    text: insuranceCat?.amount === 0 ? "No insurance document uploaded" : `Potential savings: $${insuranceCat?.amount.toLocaleString()}`,
                    color: insuranceCat?.amount === 0 ? "text-muted-foreground" : "text-fin-gain",
                    bg: insuranceCat?.amount === 0 ? "bg-muted/20" : "bg-fin-gain/10",
                    border: "border-border/20",
                  },
                ].filter(Boolean).map((finding: any, i: number) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${finding.bg} border ${finding.border}`}>
                    <finding.icon className={`size-4 ${finding.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-foreground font-sans">{finding.label}: </span>
                      <span className="text-[11px] text-muted-foreground font-sans">{finding.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Chat CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: EASE_OUT }}
            >
              <button
                onClick={() => setChatOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/30 text-foreground text-sm font-semibold hover:bg-muted/50 transition-colors border border-border/30 font-sans"
              >
                <MessageSquare className="size-4" />
                Start Chatting About Your Report
                <ArrowRight className="size-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </AppShell>
  )
}
