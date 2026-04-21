'use client'

import React, { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText, Shield, Truck, DollarSign, CheckCircle, Upload,
  ArrowRight, X, AlertCircle, ChevronRight,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/hooks/use-auth"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const DOCUMENT_TYPES = [
  { id: "contract", label: "Auto Loan Contract", icon: FileText, keywords: ["contract", "loan", "finance"] },
  { id: "warranty", label: "Extended Warranty", icon: Shield, keywords: ["warranty", "extended", "protection"] },
  { id: "tradein", label: "Trade-in Offer", icon: Truck, keywords: ["trade", "tradein", "appraisal"] },
  { id: "insurance", label: "Insurance Quote", icon: DollarSign, keywords: ["insurance", "coverage", "quote"] },
]

function detectDocumentType(filename: string): string | null {
  const lower = filename.toLowerCase()
  for (const doc of DOCUMENT_TYPES) {
    if (doc.keywords.some(k => lower.includes(k))) return doc.id
  }
  return null
}

const SAMPLE_FILES = [
  { name: "sample_contract_2023_honda_accord.pdf", label: "Use sample contract", docType: "contract" },
  { name: "sample_warranty_fidelity_national.pdf", label: "Use sample warranty", docType: "warranty" },
  { name: "sample_tradein_toyota_camry.pdf", label: "Use sample trade-in offer", docType: "tradein" },
  { name: "sample_insurance_quote.pdf", label: "Use sample insurance quote", docType: "insurance" },
]

export default function AnalyzeNewPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; type: string; detected: boolean }>
  >([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) router.replace("/")
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const addFile = useCallback((name: string, docType: string | null) => {
    const detected = docType !== null
    setUploadedFiles(prev => {
      if (prev.find(f => f.name === name)) return prev
      return [...prev, { name, size: "PDF", type: docType || "Unknown", detected }]
    })
  }, [])

  const removeFile = useCallback((name: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== name))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    Array.from(e.dataTransfer.files).forEach(file => {
      addFile(file.name, detectDocumentType(file.name))
    })
  }, [addFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(file => {
      addFile(file.name, detectDocumentType(file.name))
    })
    // reset so same file can be re-selected
    e.target.value = ""
  }, [addFile])

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        {/* Page header */}
        <div className="border-b border-border/60 bg-card/40 backdrop-blur-xl px-6 lg:px-10 py-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-2">
            <span>New Vehicle Analysis</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-semibold">Upload Documents</span>
          </div>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {step + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${
                    step === 0 ? "text-foreground" : "text-muted-foreground"
                  } font-sans`}>
                    {["Upload", "Analyzing", "Results"][step]}
                  </span>
                </div>
                {step < 2 && <div className={`flex-1 h-px max-w-16 ${step === 0 ? "bg-border" : "bg-muted"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="mb-8">
              <h1 className="text-2xl font-bold text-foreground font-display tracking-tight mb-2">Upload your documents</h1>
              <p className="text-sm text-muted-foreground font-sans">
                Drop your auto loan contract, warranty, trade-in offer, and insurance quote. We accept .pdf, .png, .jpg, .doc, .docx — up to 10MB per file.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }} className="mb-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-10 text-center cursor-pointer ${
                  dragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-border hover:bg-muted/10"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-primary/15" : "bg-muted/40"}`}>
                    <Upload className={`size-6 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Drag & drop files here, or click to browse</p>
                    <p className="text-xs text-muted-foreground font-sans mt-1">.pdf, .png, .jpg, .doc, .docx — max 10MB</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }} className="mb-8">
              <p className="text-xs text-muted-foreground font-sans mb-3">Or use sample files to preview the analysis:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_FILES.map((file) => (
                  <button key={file.name} onClick={() => addFile(file.name, file.docType)}
                    className="text-xs font-semibold px-3 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 text-foreground border border-border/30 transition-all duration-200 font-sans">
                    {file.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {uploadedFiles.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mb-8 rounded-2xl surface-card p-5"
                style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px" }}>
                <h3 className="text-sm font-bold text-foreground font-sans mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {DOCUMENT_TYPES.map((docType) => {
                    const uploaded = uploadedFiles.find(f => f.type === docType.id)
                    const Icon = docType.icon
                    return (
                      <div key={docType.id} className="flex items-center gap-3">
                        <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${uploaded ? "bg-fin-gain/12" : "bg-muted/40"}`}>
                          {uploaded ? <CheckCircle className="size-4 text-fin-gain" /> : <Icon className="size-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-semibold font-sans ${uploaded ? "text-foreground" : "text-muted-foreground"}`}>{docType.label}</p>
                          {uploaded && <p className="text-[10px] text-muted-foreground font-mono truncate">{uploaded.name}</p>}
                        </div>
                        {uploaded && (
                          <button onClick={() => removeFile(uploaded.name)} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}>
              <button
                onClick={() => router.push("/analyze/processing")}
                disabled={uploadedFiles.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  uploadedFiles.length > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" : "bg-muted/40 text-muted-foreground cursor-not-allowed"
                } font-sans`}
              >
                Analyze Documents
                <ArrowRight className="size-4" />
              </button>
              {uploadedFiles.length === 0 && (
                <p className="text-center text-xs text-muted-foreground mt-2 font-sans">Upload at least one document to continue</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
