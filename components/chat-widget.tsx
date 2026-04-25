"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const dummyResponses: Record<string, string[]> = {
  greeting: [
    "Hello! Welcome to Autocation. How can I help you today?",
    "Hi there! I'm your assistant. What would you like to know?",
  ],
  help: [
    "I can help you with:\n• Creating new analysis reports\n• Understanding your savings\n• Managing your account settings\n• Viewing report history\n\nJust ask me anything!",
    "Here's how I can assist:\n• Generate savings analysis\n• Review contract details\n• Track your reports\n• Get insights on your car purchases",
  ],
  report: [
    "To create a new report, navigate to the 'New Analysis' page and upload your car contract. I'll analyze it and provide savings insights.",
    "Report generation is easy! Go to New Analysis, upload your contract file, and I'll process it for you.",
  ],
  savings: [
    "Based on your contract analysis, I can identify areas where you may be overpaying. The AI compares your terms against market standards.",
    "Your savings potential depends on the contract details. I analyze factors like financing rate, fees, and coverage to find savings opportunities.",
  ],
  analysis: [
    "The analysis process reviews your contract terms, compares them with market benchmarks, and generates a detailed savings report.",
    "I use AI to examine your contract's financing terms, added fees, and coverage details to identify potential savings.",
  ],
}

const defaultResponses = [
  "That's an interesting question! For specific details, I'd recommend checking the Help section or contacting support.",
  "I understand. Let me help you with that. Can you provide more details?",
  "Got it! Is there anything specific about Autocation you'd like to know more about?",
  "Thanks for asking! I'd be happy to help. Could you rephrase or be more specific?",
]

function getDummyResponse(message: string): string {
  const lower = message.toLowerCase()

  if (lower.match(/^(hi|hey|hello|howdy|greetings)/)) {
    return dummyResponses.greeting[Math.floor(Math.random() * dummyResponses.greeting.length)]
  }
  if (lower.includes("help") || lower.includes("support") || lower.includes("assist")) {
    return dummyResponses.help[Math.floor(Math.random() * dummyResponses.help.length)]
  }
  if (lower.includes("report") || lower.includes("analysis") || lower.includes("new")) {
    return dummyResponses.report[Math.floor(Math.random() * dummyResponses.report.length)]
  }
  if (lower.includes("saving") || lower.includes("money") || lower.includes("cost")) {
    return dummyResponses.savings[Math.floor(Math.random() * dummyResponses.savings.length)]
  }
  if (lower.includes("analyz") || lower.includes("contract") || lower.includes("check")) {
    return dummyResponses.analysis[Math.floor(Math.random() * dummyResponses.analysis.length)]
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your Autocation assistant. Ask me anything about the platform, reports, or savings analysis.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const response = getDummyResponse(userMessage.content)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        },
      ])
      setIsLoading(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: EASE_OUT }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        {/* Glow ring when active */}
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: EASE_OUT }}
            className="absolute inset-0 rounded-full"
            style={{ background: "oklch(0.72 0.15 82 / 0.3)" }}
          />
        )}

        {/* Main button */}
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_0_1px_oklch(0.72_0.15_82_/_0.15),0_6px_18px_-10px_oklch(0.72_0.15_82_/_0.75)] transition-shadow hover:shadow-[0_0_0_1px_oklch(0.72_0.15_82_/_0.25),0_8px_24px_-10px_oklch(0.72_0.15_82_/_0.85)]"
          style={{ background: "oklch(0.72 0.15 82)" }}
        >
          {/* Section number badge */}
          <div
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.11 0.008 260)",
              color: "oklch(0.72 0.15 82)",
              boxShadow: "0 0 8px oklch(0.72 0.15 82 / 0.5)",
            }}
          >
            1
          </div>
          <MessageCircle className="h-6 w-6 text-black" />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="fixed bottom-24 right-6 z-50 flex h-[580px] w-[420px] flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: "oklch(0.175 0.01 260)",
              border: "1px solid oklch(0.28 0.01 260)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "oklch(0.28 0.01 260)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "oklch(0.72 0.15 82 / 0.15)" }}
                >
                  <Bot className="h-4 w-4" style={{ color: "oklch(0.72 0.15 82)" }} />
                </div>
                <span className="font-medium" style={{ color: "oklch(0.95 0.005 80)" }}>
                  Chat Assistant
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "oklch(0.95 0.005 80 / 0.6)" }}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          message.role === "user"
                            ? "oklch(0.72 0.15 82 / 0.15)"
                            : "oklch(0.28 0.01 260)",
                      }}
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" style={{ color: "oklch(0.72 0.15 82)" }} />
                      ) : (
                        <Bot className="h-3.5 w-3.5" style={{ color: "oklch(0.95 0.005 80 / 0.6)" }} />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "rounded-br-sm"
                          : "rounded-bl-sm"
                      }`}
                      style={{
                        background:
                          message.role === "user"
                            ? "oklch(0.72 0.15 82)"
                            : "oklch(0.20 0.01 260)",
                        color: message.role === "user"
                          ? "oklch(0.11 0.008 260)"
                          : "oklch(0.95 0.005 80)",
                      }}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "oklch(0.28 0.01 260)" }}
                    >
                      <Bot className="h-3.5 w-3.5" style={{ color: "oklch(0.95 0.005 80 / 0.6)" }} />
                    </div>
                    <div
                      className="flex gap-1 rounded-xl rounded-bl-sm px-3 py-2"
                      style={{ background: "oklch(0.20 0.01 260)" }}
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "oklch(0.72 0.15 82)", animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "oklch(0.72 0.15 82)", animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "oklch(0.72 0.15 82)", animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="flex items-center gap-2 border-t p-3"
              style={{ borderColor: "oklch(0.28 0.01 260)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-colors placeholder:text-white/30 focus:ring-2"
                style={{
                  background: "oklch(0.20 0.01 260)",
                  borderColor: "oklch(0.28 0.01 260)",
                  color: "oklch(0.95 0.005 80)",
                  ["--tw-ring-color" as string]: "oklch(0.72 0.15 82 / 0.3)",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all disabled:opacity-40"
                style={{ background: "oklch(0.72 0.15 82)" }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4 text-black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}