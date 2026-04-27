'use client'

import { AppShell } from "@/components/app-shell"
import { REPORTS, getReportById } from "@/lib/mock-data"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Loader2,
  MessageSquare,
  Share2,
  Shield,
  ThumbsUp, TrendingDown,
  X,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// ─── Animated count-up ────────────────────────────────────────────────────────

function AnimatedNumber({ value, prefix = "", duration = 1500 }: { value: number; prefix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])

  return <>{prefix}{display.toLocaleString()}</>
}

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
    { from: "ai", text: "Hi, I'm your Autocation assistant. Ask me about any finding in your report." }
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
    }, 800)
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
      {/* Header */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.from === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans ${msg.from === "ai"
              ? "bg-primary/10 text-foreground border border-primary/20"
              : "bg-primary text-primary-foreground"
              }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-5 pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-sans">Quick questions</p>
          <div className="flex flex-wrap gap-2">
            {["Refinance options?", "Cancel warranty?", "Trade-in value?"].map(q => (
              <button key={q} onClick={() => sendMessage(q)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-sans">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
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

// ─── Category card ─────────────────────────────────────────────────────────────

function CategoryCard({ category, index }: { category: typeof REPORTS[0]["categories"][0]; index: number }) {
  const Icon = category.id === "financing" ? DollarSign : category.id === "warranty" ? Shield : category.id === "tradein" ? Car : Shield

  if (category.amount === 0 && category.fields.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.08, ease: EASE_OUT }}
        className="rounded-2xl surface-card p-5 opacity-60"
        style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="size-8 rounded-xl bg-muted/40 flex items-center justify-center">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground font-sans">{category.label}</span>
        </div>
        <p className="text-xs text-muted-foreground font-sans">{category.summary}</p>
        {category.recommendation && (
          <p className="text-[10px] text-muted-foreground font-sans mt-2 italic">{category.recommendation}</p>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.08, ease: EASE_OUT }}
      className="rounded-2xl surface-card p-5"
      style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="size-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-foreground font-sans">{category.label}</span>
        {category.amount > 0 && (
          <span className="ml-auto text-sm font-bold font-mono text-fin-gain">
            ${category.amountMax ? `${category.amount.toLocaleString()}–${category.amountMax.toLocaleString()}` : category.amount.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground font-sans mb-4 leading-relaxed">{category.summary}</p>

      {/* Field rows */}
      <div className="space-y-2">
        {category.fields.map((field, fi) => (
          <div key={fi} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
            <span className="text-[11px] text-muted-foreground font-sans">{field.label}</span>
            <span className="text-[11px] font-semibold font-mono text-foreground">{field.value}</span>
          </div>
        ))}
      </div>

      {/* Flag */}
      {category.flag && (
        <div className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-chart-3/10 border border-chart-3/20">
          <AlertTriangle className="size-3 text-chart-3 shrink-0" />
          <span className="text-[11px] font-semibold text-chart-3 font-sans">{category.flag}</span>
        </div>
      )}

      {/* Recommendation */}
      {category.recommendation && (
        <div className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-fin-gain/10 border border-fin-gain/20">
          <ThumbsUp className="size-3 text-fin-gain shrink-0" />
          <span className="text-[11px] font-semibold text-fin-gain font-sans">{category.recommendation}</span>
        </div>
      )}

      {/* Sources */}
      {category.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {category.sources.map((src, si) => (
            <span key={si} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground">{src}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function ReportDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") ?? "demo-report-1"
  const report = getReportById(id)

  const [chatOpen, setChatOpen] = useState(false)
  const [prevId, setPrevId] = useState(id)

  useEffect(() => {
    if (!report) {
      router.replace("/reports")
    }
  }, [report, router])

  if (!report) return null

  const { vehicle, totalSavings, confidence, categories, nextSteps, reportDate } = report

  const savingsCategories = categories.filter(c => c.amount > 0 || c.fields.length > 0)

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        {/* Top bar */}
        <div className="border-b border-border/60 bg-card/40 backdrop-blur-xl px-6 lg:px-10 py-4">
          <div className="flex w-full items-start gap-4">
            <button
              onClick={() => router.push("/reports")}
              aria-label="Back to report history"
              className="mt-1 size-10 shrink-0 rounded-xl bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition-colors border border-border/30"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>

            <div className="min-w-0 text-left">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <button
                  onClick={() => router.push("/reports")}
                  className="hover:text-foreground transition-colors"
                >
                  Report History
                </button>
                <ChevronRight className="size-3" />
                <span className="text-foreground font-semibold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <Car className="size-4 text-primary" />
                </div>
                <div className="min-w-0 text-left">
                  <h1 className="text-base font-bold text-foreground font-display tracking-tight truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                  </h1>
                  <p className="text-[11px] text-muted-foreground font-mono truncate">{vehicle.vin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Hero banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="rounded-2xl bg-primary/8 border border-primary/20 p-6 lg:p-8 text-center overflow-hidden relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 rounded-full opacity-20 blur-[80px]" style={{ background: "oklch(0.72 0.15 82)" }} />
              </div>
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80 font-sans mb-3">Estimated Savings Found</p>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-4xl lg:text-5xl font-extrabold font-mono text-primary">
                    $<AnimatedNumber value={totalSavings} />
                  </span>
                  <span className="text-lg font-bold text-muted-foreground font-mono">*</span>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Shield className="size-3 text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">{confidence}% confidence</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 text-muted-foreground" />
                    <span className="text-xs font-muted-foreground font-sans">{reportDate}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors font-sans"
                  >
                    <MessageSquare className="size-3.5" />
                    Chat with this report
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted/60 transition-colors border border-border/30 font-sans">
                    <Download className="size-3.5" />
                    Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted/60 transition-colors border border-border/30 font-sans">
                    <Share2 className="size-3.5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Vehicle info card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <h2 className="text-sm font-bold text-foreground font-display tracking-tight mb-4">Vehicle Summary</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} mi` },
                  { label: "KBB Value", value: `$${vehicle.kbbValue.toLocaleString()}` },
                  { label: "Black Book", value: `$${vehicle.blackBookValue.toLocaleString()}` },
                  { label: "Purchase Price", value: `$${vehicle.purchasePrice.toLocaleString()}` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-sans mb-1">{item.label}</p>
                    <p className="text-sm font-bold font-mono text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {vehicle.overpayFlag && (
                <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-chart-3/10 border border-chart-3/20">
                  <TrendingDown className="size-3.5 text-chart-3 shrink-0" />
                  <span className="text-xs font-semibold text-chart-3 font-sans">{vehicle.overpayFlag}</span>
                </div>
              )}
            </motion.div>

            {/* Category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savingsCategories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>

            {/* Next steps */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: EASE_OUT }}
              className="rounded-2xl surface-card p-5"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <h2 className="text-sm font-bold text-foreground font-display tracking-tight mb-4">Next Steps</h2>
              <div className="space-y-3">
                {nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/20">
                    <div className={`size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.status === "available" ? "bg-fin-gain/12" : "bg-muted/40"
                      }`}>
                      {step.status === "available" ? (
                        <CheckCircle className="size-3.5 text-fin-gain" />
                      ) : (
                        <Clock className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground font-sans">{step.title}</p>
                      <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{step.description}</p>
                    </div>
                    {step.status === "available" && (
                      <button className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-primary font-sans">
                        Start
                        <ArrowRight className="size-2.5" />
                      </button>
                    )}
                    {step.status === "coming_soon" && (
                      <span className="shrink-0 text-[10px] font-semibold text-muted-foreground font-sans px-2 py-0.5 rounded-md bg-muted/40">Soon</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Footnotes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-center space-y-1"
            >
              <p className="text-[10px] text-muted-foreground font-sans">
                * Savings estimates are based on market data benchmarks and uploaded documents. Actual results may vary.
              </p>
              <p className="text-[10px] text-muted-foreground font-sans">
                Confidence score reflects data completeness and benchmark coverage. Data sources: KBB, Black Book, Fed H.15, Manheim, CUNA, Autocation.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </AppShell>
  )
}

export default function ReportDetailPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}>
      <ReportDetailContent />
    </Suspense>
  )
}
