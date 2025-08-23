// in components/floating-ai-icon.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BrainCircuit, Send } from "lucide-react"
import { useChat } from 'ai/react'
import { useRef, useEffect } from "react"

export function FloatingAiIcon() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ai/chat',
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    // FIX 1: The main component is now a Popover instead of a Dialog
    <Popover>
      <PopoverTrigger asChild>
        <Button className="floating-ai-button cyber-button">
          <BrainCircuit className="h-8 w-8" />
        </Button>
      </PopoverTrigger>
      
      {/* FIX 2: PopoverContent is used for the popup window */}
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="cyber-card p-0 w-96 h-[70vh] flex flex-col"
      >
        <div className="p-4 border-b border-cyber-border">
          <h3 className="font-jura cyber-text-primary flex items-center gap-2">
            <BrainCircuit /> SIKHOCode AI Assistant
          </h3>
          <p className="text-sm cyber-text mt-1">
            Your personal guide to the digital frontier.
          </p>
        </div>

        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <BrainCircuit className="flex-shrink-0 h-6 w-6 text-cyber-primary" />}
              <div className={`rounded-lg p-3 ${m.role === 'user' ? 'bg-cyber-primary text-cyber-bg-dark' : 'bg-cyber-bg-darker border border-cyber-border'}`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-cyber-border">
          <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              className="cyber-input"
              placeholder="I want to learn about..."
            />
            <Button type="submit" className="cyber-button" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}
