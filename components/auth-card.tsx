"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Shield, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

type AuthStep = "login" | "signup" | "forgot-password" | "reset-password" | "otp" | "success"
type AuthMode = "login" | "signup"

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

const authInputClass =
  "h-12 rounded-xl border border-white/10 bg-[#0b1118]/90 text-white placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 focus-visible:border-teal-400/40 focus-visible:bg-[#0d1520] focus-visible:ring-2 focus-visible:ring-teal-400/10 focus-visible:ring-offset-0"

const authPrimaryButtonClass =
  "h-11 w-full rounded-xl border border-teal-400/25 bg-teal-400/10 text-white shadow-[0_14px_32px_-24px_rgba(20,184,166,0.8)] transition-all duration-200 hover:border-teal-300/40 hover:bg-teal-400/15 disabled:opacity-50"

const authSecondaryButtonClass = "text-sm text-slate-400 transition-colors hover:text-teal-300"
const authBackButtonClass = "text-slate-400 transition-colors hover:text-teal-300"
const authBadgeClass =
  "mx-auto flex size-12 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10 shadow-[0_0_24px_-16px_rgba(45,212,191,0.9)]"

export default function AuthenticationCard() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<AuthStep>("login")
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: ["", "", "", "", "", ""],
  })

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
    const passedRequirements = passwordRequirements.filter((req) => req.test(password)).length
    if (passedRequirements === 0) return { strength: 0, label: "", color: "" }
    if (passedRequirements <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (passedRequirements <= 3) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (passedRequirements <= 4) return { strength: 75, label: "Good", color: "bg-blue-500" }
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

  const getCardHeight = () => {
    switch (step) {
      case "login":
        return "h-[480px]"
      case "signup":
        return "h-[680px]"
      case "forgot-password":
        return "h-[380px]"
      case "reset-password":
        return "h-[520px]"
      case "otp":
        return "h-[380px]"
      case "success":
        return "h-[320px]"
      default:
        return "h-[480px]"
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

    const redirectTimer = window.setTimeout(() => {
      router.push("/dashboard")
    }, 1400)

    return () => window.clearTimeout(redirectTimer)
  }, [router, shouldAutoRedirect, step])

  return (
    <div className={`w-[450px] max-w-[450px] transition-all duration-700 ease-out ${getCardHeight()}`}>
      <div className="relative h-full">
        <div className="absolute inset-0 overflow-hidden rounded-3xl surface-card border-white/5 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.95)]">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01)_42%,rgba(6,182,212,0.02))]" />
          <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -right-14 bottom-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col p-8">
          {step === "login" && (
            <div className="flex flex-1 flex-col justify-center space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                <p className="text-slate-400">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${authInputClass}`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${authInputClass}`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-teal-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button type="button" onClick={goToForgotPassword} className={authSecondaryButtonClass}>
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <button onClick={() => switchMode("signup")} className={authSecondaryButtonClass}>
                  {"Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          )}

          {step === "signup" && (
            <div className="flex flex-1 flex-col justify-center space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">Create Account</h1>
                <p className="text-slate-400">Join us today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-10 ${authInputClass}`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${authInputClass}`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${authInputClass}`}
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-teal-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Password strength</span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === 100
                              ? "text-teal-300"
                              : passwordStrength.strength >= 75
                                ? "text-cyan-300"
                                : passwordStrength.strength >= 50
                                  ? "text-slate-300"
                                  : "text-slate-500"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${req.test(formData.password) ? "bg-teal-300" : "bg-slate-700"}`} />
                            <span className={`text-xs ${req.test(formData.password) ? "text-slate-300" : "text-slate-500"}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-200">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${authInputClass}`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-teal-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading || !isSignupValid} className={authPrimaryButtonClass}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="text-center">
                <button onClick={() => switchMode("login")} className={authSecondaryButtonClass}>
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {step === "forgot-password" && (
            <div className="flex flex-1 flex-col justify-center space-y-6">
              <button onClick={resetToLogin} className={`absolute left-6 top-6 ${authBackButtonClass}`}>
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
                <p className="text-slate-400">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${authInputClass}`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </div>
          )}

          {step === "reset-password" && (
            <div className="flex flex-1 flex-col justify-center space-y-6">
              <button onClick={() => setStep("forgot-password")} className={`absolute left-6 top-6 ${authBackButtonClass}`}>
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="space-y-2 text-center">
                <div className={authBadgeClass}>
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-semibold text-white">Create New Password</h1>
                <p className="text-slate-400">Enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-slate-200">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${authInputClass}`}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-teal-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password" className="text-slate-200">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary opacity-70" />
                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${authInputClass}`}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-teal-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.password || formData.password !== formData.confirmPassword}
                  className={authPrimaryButtonClass}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div className="flex flex-1 flex-col justify-center space-y-6">
              <button onClick={() => setStep(mode)} className={`absolute left-6 top-6 ${authBackButtonClass}`}>
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">Verify Your Email</h1>
                <p className="text-slate-400">Enter the 6-digit code sent to</p>
                <p className="font-medium text-slate-200">{formData.email}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-3">
                  {formData.otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={`h-12 w-12 rounded-xl text-center text-lg font-semibold ${authInputClass}`}
                      maxLength={1}
                    />
                  ))}
                </div>

                <Button type="submit" disabled={isLoading || formData.otp.some((digit) => !digit)} className={authPrimaryButtonClass}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>

              <div className="text-center">
                <button className={authSecondaryButtonClass}>Resend code</button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6">
              <button
                onClick={resetToLogin}
                className="absolute right-6 top-6 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-teal-300"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10 shadow-[0_0_32px_-18px_rgba(45,212,191,0.95)]">
                <Check className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">{mode === "signup" ? "Welcome!" : "Success!"}</h1>
                <p className="text-slate-400">
                  {mode === "signup" ? "Your account has been created successfully" : "You're signed in successfully"}
                </p>
                {shouldAutoRedirect && <p className="text-xs text-teal-300/80">Redirecting you to the dashboard...</p>}
              </div>

              <Button onClick={() => router.push("/dashboard")} className={authPrimaryButtonClass}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
