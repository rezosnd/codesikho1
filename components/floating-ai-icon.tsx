"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Send, Loader2 } from "lucide-react"
import { useChat } from 'ai/react'
import { useRef, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export function FloatingAiIcon() {
  const { userProfile } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error 
  } = useChat({
    api: '/api/ai/chat',
    body: {
      userProfile: userProfile,
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Custom submit handler to prevent default form behavior
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSubmit(e);
    }
  };

  // Don't render anything until mounted and user profile is loaded
  if (!isMounted) {
    return null;
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="floating-ai-button cyber-button fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
          disabled={!userProfile}
        >
          {!userProfile ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <BrainCircuit className="h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="cyber-card p-0 w-96 h-[70vh] flex flex-col border-2 border-cyber-primary bg-cyber-bg-dark"
      >
        {/* Header */}
        <div className="p-4 border-b border-cyber-border bg-cyber-bg-darker">
          <h3 className="font-jura cyber-text-primary flex items-center gap-2 text-lg font-bold">
            <BrainCircuit className="h-5 w-5" /> 
            SIKHOCode AI Assistant
          </h3>
          <p className="text-sm cyber-text mt-1">
            {userProfile ? `Hello, ${userProfile.displayName}! Ready to learn?` : "Your personal guide to the digital frontier."}
          </p>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef} 
          className="flex-grow p-4 overflow-y-auto space-y-4 bg-cyber-bg-dark"
        >
          {!userProfile ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-cyber-primary" />
              <span className="ml-2 cyber-text">Loading your profile...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-20">
              <div className="text-red-400 text-center">
                <p>Failed to send message</p>
                <p className="text-sm">Please try again</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <BrainCircuit className="h-12 w-12 text-cyber-primary opacity-50" />
              <p className="cyber-text text-sm">
                Welcome to your AI learning assistant!<br />
                Ask me about any programming topic.
              </p>
              <div className="space-y-2 text-xs cyber-text-secondary">
                <p>Try: "I want to learn React"</p>
                <p>Or: "Explain JavaScript closures"</p>
                <p>Or: "Help me with Python functions"</p>
              </div>
            </div>
          ) : (
            messages.map(m => (
              <div 
                key={m.id} 
                className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyber-primary flex items-center justify-center">
                    <BrainCircuit className="h-3 w-3 text-cyber-bg-dark" />
                  </div>
                )}
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    m.role === 'user' 
                      ? 'bg-cyber-primary text-cyber-bg-dark' 
                      : 'bg-cyber-bg-darker border border-cyber-border cyber-text'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-cyber-border bg-cyber-bg-darker">
          <form onSubmit={handleFormSubmit} className="w-full flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              className="cyber-input flex-1"
              placeholder={
                !userProfile 
                  ? "Please wait..." 
                  : isLoading 
                    ? "AI is thinking..." 
                    : "I want to learn about..."
              }
              disabled={!userProfile || isLoading}
            />
            <Button 
              type="submit" 
              className="cyber-button" 
              size="icon"
              disabled={!userProfile || isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          {/* Status indicator */}
          <div className="flex justify-between items-center mt-2 text-xs cyber-text-secondary">
            <span>
              {userProfile ? `Level ${userProfile.level} • ${userProfile.xp} XP` : "Loading..."}
            </span>
            <span>
              {isLoading ? "AI is typing..." : "Ready"}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
