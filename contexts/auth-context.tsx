"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface UserProfile {
  uid: string
  email: string
  displayName: string
  level: number
  xp: number
  badges: string[]
  completedChallenges: string[]
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up auth state listener...")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "User logged out")
      setUser(user)
      if (user) {
        console.log("Loading user profile for UID:", user.uid)
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserProfile = async (uid: string) => {
    try {
      console.log("Fetching user profile from API...")
      const response = await fetch(`/api/users?uid=${uid}`)
      console.log("API response status:", response.status)

      if (response.ok) {
        const userDoc = await response.json()
        console.log("User profile loaded:", userDoc ? "Found" : "Not found")
        if (userDoc) {
          setUserProfile(userDoc as UserProfile)
        } else {
          console.log("No user profile found, user may need to complete setup")
        }
      } else {
        const errorText = await response.text()
        console.error("Failed to load user profile, status:", response.status, "Error:", errorText)
      }
    } catch (error) {
      console.error("Network error loading user profile:", error)
    }
  }

  const createUserProfile = async (user: User, displayName: string) => {
    console.log("Creating user profile for:", user.email)
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName || user.displayName || "Anonymous",
      level: 1,
      xp: 0,
      badges: [],
      completedChallenges: [],
      createdAt: new Date(),
    }

    try {
      console.log("Sending user profile to API...")
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      })

      console.log("User profile creation response:", response.status)
      if (response.ok) {
        setUserProfile(userProfile)
        console.log("User profile created successfully")
      } else {
        const errorText = await response.text()
        console.error("Failed to create user profile:", errorText)
        setUserProfile(userProfile)
      }
    } catch (error) {
      console.error("Network error creating user profile:", error)
      setUserProfile(userProfile)
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      console.log("Refreshing user profile...")
      await loadUserProfile(user.uid)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in for:", email)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful for:", result.user.email)
    } catch (error: any) {
      console.error("Sign in error:", error.code, error.message)
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email address")
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      } else {
        throw new Error("Sign in failed. Please try again.")
      }
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    console.log("Attempting sign up for:", email)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log("Sign up successful, creating profile...")
      await createUserProfile(result.user, displayName)
    } catch (error: any) {
      console.error("Sign up error:", error.code, error.message)
      if (error.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists")
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      } else {
        throw new Error("Sign up failed. Please try again.")
      }
    }
  }

  const signInWithGoogle = async () => {
    console.log("Attempting Google sign in...")
    console.log("Google provider configured:", !!googleProvider)
    console.log("Auth instance:", !!auth)

    try {
      console.log("Calling signInWithPopup...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in successful for:", result.user.email)
      console.log("User details:", {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      })

      // Check if user profile exists
      console.log("Checking for existing user profile...")
      const response = await fetch(`/api/users?uid=${result.user.uid}`)
      console.log("User check response status:", response.status)

      if (response.ok) {
        const existingUser = await response.json()
        if (!existingUser) {
          console.log("Creating new user profile for Google user")
          await createUserProfile(result.user, result.user.displayName || "Anonymous")
        } else {
          console.log("Existing Google user profile found")
        }
      } else {
        console.log("Error checking existing user, creating new profile")
        await createUserProfile(result.user, result.user.displayName || "Anonymous")
      }
    } catch (error: any) {
      console.error("Google sign in error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      })

      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign in was cancelled")
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("Popup was blocked. Please allow popups and try again.")
      } else if (error.code === "auth/unauthorized-domain") {
        throw new Error("This domain is not authorized for Google sign-in. Please contact support.")
      } else {
        throw new Error(`Google sign in failed: ${error.message}`)
      }
    }
  }

  const logout = async () => {
    console.log("Logging out user...")
    try {
      await signOut(auth)
      console.log("Logout successful")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
