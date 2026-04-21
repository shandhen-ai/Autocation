import AuthenticationCard from "@/components/auth-card"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05080d] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(34,211,238,0.08),transparent_18%),linear-gradient(180deg,#05080d_0%,#090d14_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <AuthenticationCard />
      </div>
      <footer className="relative z-10 mb-6">
        <div className="rounded-2xl border border-white/5 bg-[#0b1118]/70 px-6 py-3 backdrop-blur-sm">
          <p className="text-center font-sans text-sm text-muted-foreground">
            Powered by <span className="text-primary">Autocation</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
