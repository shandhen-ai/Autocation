"use client"

import type React from "react"

import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Shield, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

type AuthStep = "login" | "signup" | "forgot-password" | "reset-password" | "otp" | "success"
type AuthMode = "login" | "signup"

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1693812297258-f40a443cae14?q=80&w=1316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "",
    label: "Premium Inventory",
    description: "Access dealer pricing data",
  },
  {
    src: "https://images.unsplash.com/photo-1652509621255-709c807ed7c2?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Luxury sports car in elegant showroom",
    label: "Market Analysis",
    description: "Real-time price verification",
  },
  {
    src: "/3rd.jpeg",
    alt: "Modern dealership with premium vehicles",
    label: "Fair Pricing",
    description: "Know what cars are really worth",
  },
  {
    src: "https://images.unsplash.com/photo-1653565217811-85b41bcd1edb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Elegant automotive retail space",
    label: "Smart Decisions",
    description: "Data-driven car buying",
  },
]

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number", test: (pwd) => /\d/.test(pwd) },
  { label: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
]

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b1118]/90 pl-10 pr-10 text-white placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 placeholder:text-start focus:border-gold-400/40 focus:bg-[#0d1520] focus:ring-2 focus:ring-gold-400/10 focus:ring-offset-0 focus:outline-none"

const inputWithIconClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b1118]/90 pl-10 text-white placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 focus:border-gold-400/40 focus:bg-[#0d1520] focus:ring-2 focus:ring-gold-400/10 focus:ring-offset-0 focus:outline-none"

const primaryBtnClass =
  "h-11 w-full rounded-xl border border-gold-400/25 bg-gradient-to-r from-gold-400/15 to-gold-400/5 text-white font-medium tracking-wide shadow-[0_8px_32px_-12px_rgba(212,160,56,0.5)] transition-all duration-300 hover:border-gold-300/40 hover:from-gold-400/20 hover:to-gold-400/10 hover:shadow-[0_12px_40px_-12px_rgba(212,160,56,0.65)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"


export default function AuthenticationCard() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<AuthStep>("login")
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: ["", "", "", "", "", ""],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
        setIsTransitioning(false)
      }, 350)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp]
      newOtp[index] = value
      setFormData((prev) => ({ ...prev, otp: newOtp }))
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const getPasswordStrength = (password: string) => {
    const passed = passwordRequirements.filter((req) => req.test(password)).length
    if (passed === 0) return { strength: 0, label: "", color: "" }
    if (passed <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (passed <= 3) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (passed <= 4) return { strength: 75, label: "Good", color: "bg-blue-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (step === "login") {
      if (formData.email.toLowerCase() === "lee@auto-cation.com") {
        login(formData.email)
        setShouldAutoRedirect(true)
        setStep("success")
      } else {
        setShouldAutoRedirect(false)
        setStep("otp")
      }
    } else if (step === "signup") {
      setShouldAutoRedirect(false)
      setStep("otp")
    } else if (step === "forgot-password") {
      setShouldAutoRedirect(false)
      setStep("reset-password")
    } else if (step === "reset-password") {
      setShouldAutoRedirect(false)
      setStep("success")
    } else if (step === "otp") {
      login(formData.email)
      setShouldAutoRedirect(true)
      setStep("success")
    }

    setIsLoading(false)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setStep(newMode)
    setFormData({ email: "", password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] })
  }

  const resetToLogin = () => {
    setShouldAutoRedirect(false)
    setStep("login")
    setMode("login")
    setFormData({ email: "", password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] })
  }

  const goToForgotPassword = () => {
    setStep("forgot-password")
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] }))
  }

  const getFormHeight = () => {
    switch (step) {
      case "login":
        return "min-h-[420px]"
      case "signup":
        return "min-h-[580px]"
      case "forgot-password":
        return "min-h-[340px]"
      case "reset-password":
        return "min-h-[460px]"
      case "otp":
        return "min-h-[340px]"
      case "success":
        return "min-h-[300px]"
      default:
        return "min-h-[420px]"
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isSignupValid =
    step === "signup" &&
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordRequirements.every((req) => req.test(formData.password))

  useEffect(() => {
    if (step !== "success" || !shouldAutoRedirect) return
    const timer = window.setTimeout(() => router.push("/dashboard"), 1400)
    return () => window.clearTimeout(timer)
  }, [router, shouldAutoRedirect, step])

  return (
    <div className="flex min-h-screen w-full bg-[#05080d]">
      {/* Left: Auth Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-[55%] lg:px-16">
        <div className={`w-full max-w-[440px] ${getFormHeight()} transition-all duration-500`}>
          {/* Logo */}
          <div className="">
            <img src="/autocation-logo.png" alt="Autocation" className="h-auto w-[160px] object-contain" />
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d14]/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {/* Card glow effects */}
            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-gold-400/[0.06] blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gold-400/[0.05] blur-3xl" />

            <div className="relative px-8 py-8">
              {step === "login" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="mt-1 text-sm text-slate-400">Sign in to access your dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={inputWithIconClass}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-slate-300">Password</Label>
                        <button type="button" onClick={goToForgotPassword} className="text-xs text-gold-400/70 hover:text-gold-300 transition-colors">
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={inputClass}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className={primaryBtnClass}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => switchMode("signup")} className="font-medium text-gold-400 hover:text-gold-300 transition-colors">
                      Create one
                    </button>
                  </p>
                </div>
              )}

              {step === "signup" && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="mt-1 text-sm text-slate-400">Start analyzing car costs today</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={inputWithIconClass}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={inputWithIconClass}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={inputClass}
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {formData.password && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Password strength</span>
                            <span
                              className={`text-[11px] font-medium ${passwordStrength.strength === 100
                                ? "text-gold-300"
                                : passwordStrength.strength >= 75
                                  ? "text-gold-400"
                                  : passwordStrength.strength >= 50
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-slate-800">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {passwordRequirements.map((req, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <div className={`h-1.5 w-1.5 rounded-full ${req.test(formData.password) ? "bg-gold-400" : "bg-slate-700"}`} />
                                <span className={`text-[10px] ${req.test(formData.password) ? "text-slate-300" : "text-slate-600"}`}>{req.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={inputClass}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-[11px] text-red-400">Passwords do not match</p>
                      )}
                    </div>

                    <Button type="submit" disabled={isLoading || !isSignupValid} className={primaryBtnClass}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button onClick={() => switchMode("login")} className="font-medium text-gold-400 hover:text-gold-300 transition-colors">
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {step === "forgot-password" && (
                <div className="space-y-6">
                  <button onClick={resetToLogin} className="flex items-center gap-2 text-sm text-slate-400 hover:text-gold-300 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </button>

                  <div>
                    <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                    <p className="mt-1 text-sm text-slate-400">Enter your email for reset instructions</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="reset-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={inputWithIconClass}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className={primaryBtnClass}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </div>
              )}

              {step === "reset-password" && (
                <div className="space-y-6">
                  <button onClick={() => setStep("forgot-password")} className="flex items-center gap-2 text-sm text-slate-400 hover:text-gold-300 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 shadow-[0_0_32px_-12px_rgba(212,160,56,0.55)]">
                      <Shield className="h-6 w-6 text-gold-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">New Password</h1>
                    <p className="mt-1 text-sm text-slate-400">Create a secure password</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={inputClass}
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/60" />
                        <Input
                          id="confirm-new-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={inputClass}
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-[11px] text-red-400">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !formData.password || formData.password !== formData.confirmPassword}
                      className={primaryBtnClass}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-6">
                  <button onClick={() => setStep(mode)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-gold-300 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <div>
                    <h1 className="text-2xl font-bold text-white">Verify Email</h1>
                    <p className="mt-1 text-sm text-slate-400">
                      Enter the 6-digit code sent to{" "}
                      <span className="text-slate-200">{formData.email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                      {formData.otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="h-12 w-12 rounded-xl border border-white/10 bg-[#0b1118]/90 text-center text-lg font-semibold text-white transition-all duration-200 placeholder:text-start focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 focus:outline-none"
                          maxLength={1}
                        />
                      ))}
                    </div>

                    <Button type="submit" disabled={isLoading || formData.otp.some((d) => !d)} className={primaryBtnClass}>
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-slate-400">
                    Didn&apos;t get the code?{" "}
                    <button className="font-medium text-gold-400 hover:text-gold-300 transition-colors">Resend</button>
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <button
                    onClick={resetToLogin}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-gold-300"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 shadow-[0_0_40px_-12px_rgba(212,160,56,0.55)]">
                    <Check className="h-8 w-8 text-gold-400" />
                  </div>

                  <h1 className="text-2xl font-bold text-white">{mode === "signup" ? "Welcome!" : "Success!"}</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    {mode === "signup" ? "Your account has been created" : "You are signed in"}
                  </p>
                  {shouldAutoRedirect && <p className="mt-2 text-xs text-gold-400/70">Redirecting to dashboard...</p>}

                  <Button onClick={() => router.push("/dashboard")} className={`${primaryBtnClass} mt-6`}>
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right: Carousel Panel */}
      <div className="relative hidden w-[45%] lg:flex lg:flex-col">
        {/* Image Background */}
        <div className="absolute inset-0">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#05080d] via-[#05080d]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#05080d]/20 via-transparent to-[#05080d]/60" />

        {/* Slide Content */}
        <div className="relative z-20 flex flex-1 flex-col justify-end p-12">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-sm transition-all duration-500 ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {carouselImages[currentSlide].label}
            </div>

            <h2
              className={`text-4xl font-bold leading-tight text-white transition-all duration-500 ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}
            >
              {carouselImages[currentSlide].description}
            </h2>
          </div>

          {/* Carousel Navigation */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-2">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsTransitioning(true)
                    setTimeout(() => {
                      setCurrentSlide(idx)
                      setIsTransitioning(false)
                    }, 400)
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-gold-400" : "w-3 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/40">
              {currentSlide + 1} / {carouselImages.length}
            </span>
          </div>
        </div>

        {/* Brand Mark */}
        <div className="absolute right-8 top-5 z-20">
          <img src="/autocation-logo.png" alt="Autocation" className="h-auto w-[100px] object-contain" />
        </div>
      </div>
    </div>
  )
}
