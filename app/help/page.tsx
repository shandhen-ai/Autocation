'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  HelpCircle, ChevronDown, ChevronUp, Mail, ExternalLink,
  Shield, FileText, ArrowRight,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/hooks/use-auth"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const FAQ_ITEMS = [
  {
    q: "How does Autocation analyze my documents?",
    a: "We use OCR to extract text from your uploaded documents, then cross-reference key data points (APR, loan terms, warranty prices, trade-in values) against trusted benchmarks like Kelley Blue Book, Black Book, Manheim, and Federal Reserve rate data.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All documents are encrypted in transit and at rest. We never share your personal data with dealers or third parties. You can delete your data at any time from the Settings page.",
  },
  {
    q: "How accurate are the savings estimates?",
    a: "Our confidence score (shown on every report) reflects how many benchmarks we could cross-reference. A 90%+ confidence means we found multiple verified data sources. Lower confidence means some fields were estimated based on partial data.",
  },
  {
    q: "Can I cancel my warranty after signing?",
    a: "Most dealer warranties include a 30-day cancellation window. Contact the warranty provider directly — we show the cancellation contact info in your report's Next Steps section. Refunds typically process within 2–3 weeks.",
  },
  {
    q: "Does Autocation work with any vehicle?",
    a: "Autocation analyzes any vehicle for which you have documentation. The more documents you upload (loan contract, warranty, trade-in appraisal, insurance), the more comprehensive your savings report will be.",
  },
]

export default function HelpPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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
              Support
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground font-display justify-self-center">
              Help & FAQ
            </h1>
            <div className="hidden lg:block" />
          </div>
        </PageHeader>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <button
                onClick={() => router.push("/analyze/new")}
                className="flex items-center gap-3 p-4 rounded-2xl surface-card text-left hover:bg-accent/20 transition-all"
                style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
              >
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-sans">Analyze a Contract</p>
                  <p className="text-[11px] text-muted-foreground font-sans">Upload and analyze your documents</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => window.open("mailto:support@autocation.com", "_self")}
                className="flex items-center gap-3 p-4 rounded-2xl surface-card text-left hover:bg-accent/20 transition-all border border-chart-3/20 bg-chart-3/5"
              >
                <div className="size-10 rounded-xl bg-chart-3/12 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-sans">Contact Support</p>
                  <p className="text-[11px] text-muted-foreground font-sans">support@autocation.com</p>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground ml-auto" />
              </button>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: EASE_OUT }}
              className="rounded-2xl surface-card overflow-hidden"
              style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground font-display tracking-tight">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-border/30">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/10 transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground font-sans pr-4">{item.q}</span>
                      {openFaq === i ? (
                        <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                        className="px-5 pb-4"
                      >
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
              className="space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">Legal</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Privacy Policy", icon: Shield },
                  { label: "Terms of Service", icon: FileText },
                  { label: "Data Deletion", icon: FileText },
                ].map((link) => (
                  <button
                    key={link.label}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors font-sans"
                  >
                    <link.icon className="size-3" />
                    {link.label}
                    <ExternalLink className="size-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="p-4 rounded-xl bg-muted/20 border border-border/20"
            >
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
                <strong className="text-foreground">Disclaimer:</strong> Autocation provides estimates and analysis for informational purposes only. Savings figures are based on benchmark data and may not reflect actual outcomes. Always consult with a financial advisor before making major financial decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
