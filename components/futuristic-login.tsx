"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { User, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react"

interface FuturisticLoginProps {
  onClose: () => void
}

export function FuturisticLogin({ onClose }: FuturisticLoginProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isLogin) {
        await signIn(email, password)
        setSuccess("Login successful!")
      } else {
        await signUp(email, password, displayName)
        setSuccess("Account created successfully!")
      }
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signInWithGoogle()
      setSuccess("Google sign in successful!")
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError(error.message || "Google sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
  }

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement
      const icon = target.parentElement?.querySelector(".input-icon")
      if (icon) {
        icon.classList.add("glow-icon")
      }
    }

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement
      const icon = target.parentElement?.querySelector(".input-icon")
      if (icon) {
        icon.classList.remove("glow-icon")
      }
    }

    const inputs = [emailRef.current, passwordRef.current, nameRef.current].filter(Boolean)
    inputs.forEach((input) => {
      input?.addEventListener("focus", handleFocus)
      input?.addEventListener("blur", handleBlur)
    })

    return () => {
      inputs.forEach((input) => {
        input?.removeEventListener("focus", handleFocus)
        input?.removeEventListener("blur", handleBlur)
      })
    }
  }, [isLogin])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="login-form-container">
        <div className="login-form">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">{isLogin ? "Login" : "Sign Up"}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
              <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-900 rounded-full"></div>
              </div>
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="input-group">
                <User className="input-icon text-cyan-400" size={20} />
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-text"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div className="input-group">
              <Mail className="input-icon text-cyan-400" size={20} />
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-text"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon text-cyan-400" size={20} />
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-text"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 text-cyan-400/60 hover:text-cyan-400"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="login-button">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 rounded-full py-3 text-lg font-semibold tracking-wider transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-transparent border border-purple-400 text-purple-400 hover:bg-purple-400/10 rounded-full py-3 text-lg font-semibold tracking-wider transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue with Google"}
            </Button>
          </div>

          <div className="footer">
            <button
              type="button"
              onClick={toggleMode}
              className="text-cyan-400/80 hover:text-cyan-400 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-cyan-400/80 hover:text-cyan-400 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
