"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BrainCircuit } from "lucide-react"

export function FloatingAiIcon() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="floating-ai-button cyber-button">
          <BrainCircuit className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="cyber-card">
        <DialogHeader>
          <DialogTitle className="font-jura cyber-text-primary flex items-center gap-2">
            <BrainCircuit /> AI Assistant
          </DialogTitle>
          <DialogDescription className="cyber-text">
            Ask me anything about your progress, code, or quizzes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* This is a placeholder for a real chat interface */}
          <div className="p-4 rounded-lg bg-cyber-bg-darker text-sm cyber-text border border-cyber-border">
            AI: Welcome back, Operative. How can I assist you in the grid today?
          </div>
          <Input className="cyber-input" placeholder="Type your query..." />
        </div>
        <DialogFooter>
          <Button className="cyber-button font-jura w-full">Send Query</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
