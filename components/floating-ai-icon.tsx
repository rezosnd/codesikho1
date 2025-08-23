// in components/floating-ai-icon.tsx (you can rename the file to ai-chat-assistant.tsx if you like)

"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Send } from "lucide-react"
import { useChat } from 'ai/react'
import { useRef, useEffect } from "react"

export function FloatingAiIcon() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ai/chat', // Points to the backend route we just created
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="floating-ai-button cyber-button">
          <BrainCircuit className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="cyber-card p-0 max-w-lg h-[70vh] flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-jura cyber-text-primary flex items-center gap-2">
            <BrainCircuit /> SIKHOCode AI Assistant
          </DialogTitle>
          <DialogDescription className="cyber-text">
            Your personal guide to the digital frontier. Ask me what you want to learn.
          </DialogDescription>
        </DialogHeader>

        <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <BrainCircuit className="flex-shrink-0 h-6 w-6 text-cyber-primary" />}
              <div className={`rounded-lg p-3 ${m.role === 'user' ? 'bg-cyber-primary text-cyber-bg-dark' : 'bg-cyber-bg-darker border border-cyber-border'}`}>
                <p className="leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="p-4 border-t border-cyber-border">
          <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              className="cyber-input"
              placeholder="I want to learn about Python decorators..."
            />
            <Button type="submit" className="cyber-button" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
