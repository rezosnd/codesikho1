// components/futuristic-login.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export function FuturisticLogin({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await signInWithGoogle()
      setSuccess("External network link successful. Access granted.")
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Google sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="cyber-card cyber-holo w-full max-w-md animate-in fade-in zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-jura cyber-text-primary cyber-glow">
          Establish Neural Link
        </CardTitle>
        <CardDescription className="cyber-text pt-2">
          Authenticate with an external provider to access the Grid
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

        <div className="mt-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full cyber-button-outline font-jura text-base"
          >
            <svg
              className="mr-2 h-5 w-5"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 60.1l-65.7 64.3C340.5 91.2 296.2 64 248 64c-70.7 0-128 57.3-128 128s57.3 128 128 128c81.5 0 114.2-51.5 119.1-79.1H248v-64h239.2c1.3 12.3 2.8 24.3 2.8 36.8z"
              ></path>
            </svg>
            {loading ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
