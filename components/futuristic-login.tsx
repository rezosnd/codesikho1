// components/futuristic-login.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"

export function FuturisticLogin({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      if (isLogin) {
        await signIn(email, password)
        setSuccess("Connection established. Access granted.")
      } else {
        await signUp(email, password, displayName)
        setSuccess("Operative ID created. Welcome to the grid.")
      }
      setTimeout(() => { onClose() }, 1500)
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.")
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
      setSuccess("External network link successful.")
      setTimeout(() => { onClose() }, 1500)
    } catch (err: any) {
      setError(err.message || "Google sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
  }

  return (
    <Card className="cyber-card cyber-holo w-full max-w-md animate-in fade-in zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-jura cyber-text-primary cyber-glow">
          {isLogin ? "Establish Neural Link" : "Create Operative ID"}
        </CardTitle>
        <CardDescription className="cyber-text pt-2">
          {isLogin ? "Authenticate to access the Grid" : "Register for Grid access"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 font-jura">
            <AlertCircle size={20} /> <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400 font-jura">
            <CheckCircle size={20} /> <span className="text-sm">{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-text" />
              <Input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="cyber-input pl-10"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-text" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input pl-10"
              required
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-text" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input pl-10"
              required
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-cyber-text hover:text-cyber-primary"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          <Button type="submit" disabled={loading} className="w-full cyber-button font-jura text-base">
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-cyber-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-cyber-bg-darker px-2 cyber-text">Or Continue With</span></div>
        </div>

        <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full cyber-button-outline font-jura text-base">
          <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 60.1l-65.7 64.3C340.5 91.2 296.2 64 248 64c-70.7 0-128 57.3-128 128s57.3 128 128 128c81.5 0 114.2-51.5 119.1-79.1H248v-64h239.2c1.3 12.3 2.8 24.3 2.8 36.8z"></path></svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <Button variant="link" onClick={toggleMode} disabled={loading} className="cyber-text hover:text-cyber-primary">
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  )
}
