import type React from "react"
import type { Metadata } from "next"
import { Jura } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingAiIcon } from "@/components/floating-ai-icon" 
import "./globals.css"

// Setup the Jura font with a CSS variable
const jura = Jura({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jura",
})

// Update the metadata for the new theme
export const metadata: Metadata = {
  title: "SIKHOCode - Futuristic Learning Platform",
  description: "Gamified coding education with cyberpunk aesthetics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Apply the font variable to the html tag for global access
    <html lang="en" className={`${jura.variable} antialiased`} suppressHydrationWarning>
      <body>
        {/* The ThemeProvider forces dark mode and must wrap everything */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Your AuthProvider stays inside to manage user state */}
          <AuthProvider>{children}<FloatingAiIcon /></AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
