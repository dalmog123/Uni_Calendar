"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  User,
  Loader2,
  Sparkles,
  X,
  ArrowUp,
  Copy
} from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  isThinking?: boolean
}

interface PkudaChatPanelProps {
  isOpen: boolean
  onClose: () => void
  initialText?: string
  actionType?: "explain" | "examples" | "conditions" | "rulings"
  systemPrompt: string
}

// כותרות לכל סוג פעולה
const ACTION_TITLES = {
  explain: "הסבר מפורט של הסעיף",
  examples: "דוגמאות מעשיות ויישום",
  conditions: "תנאים וקריטריונים למימוש",
  rulings: "פסקי דין מפורסמים ופרשנות משפטית"
}

// פרומפטים מותאמים לכל סוג פעולה
const ACTION_PROMPTS = {
  explain: (text: string) => `הסבר לי בצורה מפורטת את הסעיף הבא מפקודת מס הכנסה:\n\n${text}`,
  examples: (text: string) => `הבא לי דוגמאות מעשיות ויישומיות של הסעיף הבא מפקודת מס הכנסה:\n\n${text}`,
  conditions: (text: string) => `מה התנאים והקריטריונים למימוש הסעיף הבא מפקודת מס הכנסה?\n\n${text}`,
  rulings: (text: string) => `מצא פסקי דין מפורסמים ופרשנות משפטית רלוונטית לסעיף הבא מפקודת מס הכנסה:\n\n${text}`
}

export function PkudaChatPanel({ isOpen, onClose, initialText, actionType = "explain", systemPrompt }: PkudaChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const requestInFlightRef = useRef(false)

  // Initialize with initial text if provided
  const hasInitialized = useRef(false)
  useEffect(() => {
    if (isOpen && initialText && !hasInitialized.current) {
      hasInitialized.current = true
      // Auto-send the initial analysis request with the appropriate prompt
      const analysisRequest = ACTION_PROMPTS[actionType](initialText)
      // Use setTimeout to avoid calling sendMessage during render
      setTimeout(() => {
        sendMessage(analysisRequest)
      }, 100)
    }
    if (!isOpen) {
      hasInitialized.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialText, actionType])

  // Reset messages when panel closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setInputMessage("")
    }
  }, [isOpen])

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollViewport) {
        scrollViewport.scrollTo({
          top: scrollViewport.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || requestInFlightRef.current) return

    // Get current messages for history before updating state
    const currentMessages = messages
    const history = currentMessages
      .filter(msg => !msg.isThinking)
      .map(msg => ({
        content: msg.content,
        isUser: msg.isUser,
      }))

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "אני חושב על התשובה...",
      isUser: false,
      timestamp: new Date(),
      isThinking: true,
    }

    // Update state with user message and thinking message
    setMessages((prev) => [...prev, userMessage, thinkingMessage])
    setInputMessage("")
    setIsLoading(true)
    requestInFlightRef.current = true

    try {
      // Send the request to the generic endpoint
      const response = await fetch("/api/chat/generic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content,
          history,
          systemPrompt
        }),
      })

      const data = await response.json()

      setMessages((prev) => prev.filter((msg) => !msg.isThinking))

      if (!response.ok) {
        throw new Error(data.error || "שגיאה בתקשורת עם השרת")
      }

      if (!data.response) {
        throw new Error("תשובה לא תקינה מהשרת")
      }

      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.isThinking))
      console.error("Error in chat:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: error instanceof Error 
          ? `מצטער, אירעה שגיאה: ${error.message}` 
          : "מצטער, אירעה שגיאה. אנא נסה שוב מאוחר יותר.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      requestInFlightRef.current = false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    sendMessage(inputMessage.trim())
  }

  const copyMessageText = async (content: string) => {
    try {
      // Extract plain text from markdown content (remove markdown syntax)
      // Simple approach: just use the raw content, or we could use a markdown parser
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  // Handle copy events to extract plain text only (no HTML elements)
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer as Node
      
      // Check if the selection is within a message bubble
      const messageBubble = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('[data-message-bubble]')
        : (container as Element).closest('[data-message-bubble]')
      
      if (messageBubble) {
        e.preventDefault()
        e.stopPropagation()
        
        // Get the selected text - this already strips HTML tags
        let plainText = selection.toString()
        
        // If selection.toString() doesn't work well, extract from range
        if (!plainText || plainText.trim().length === 0) {
          const tempDiv = document.createElement('div')
          const clonedRange = range.cloneContents()
          tempDiv.appendChild(clonedRange)
          plainText = tempDiv.textContent || tempDiv.innerText || ''
        }
        
        // Clean up: normalize whitespace but preserve line breaks
        const cleanedText = plainText
          .replace(/\r\n/g, '\n') // Normalize line breaks
          .replace(/\r/g, '\n')
          .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
          .replace(/[ \t]*\n[ \t]*/g, '\n') // Clean up spaces around newlines
          .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
          .trim()
        
        // Set only plain text, no HTML
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', cleanedText)
          e.clipboardData.clearData('text/html')
        }
      }
    }

    // Use capture phase to intercept before browser processes it
    document.addEventListener('copy', handleCopy, true)
    return () => document.removeEventListener('copy', handleCopy, true)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 w-full md:w-[500px] z-50 shadow-2xl" dir="rtl">
      <Card className="h-full border-0 shadow-xl bg-white rounded-none md:rounded-l-3xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">{ACTION_TITLES[actionType]}</h1>
              <p className="text-xs text-white/80">פקודת מס הכנסה</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages List */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full w-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.isUser ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div 
                    className={`flex gap-3 max-w-[330px] min-w-0 ${message.isUser ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ${
                      message.isUser 
                        ? "bg-white border border-slate-200" 
                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    }`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-slate-600" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col gap-1 min-w-0 flex-1 group ${message.isUser ? "items-start" : "items-end"}`}>
                      <div
                        data-message-bubble
                        className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                          message.isUser
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : message.isThinking
                            ? "bg-slate-50 border border-slate-200 text-slate-500 rounded-tl-none flex items-center gap-2"
                            : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                        }`}
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '400px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {message.isThinking ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{message.content}</span>
                          </>
                        ) : (
                          <div 
                            className={`prose prose-sm max-w-none ${message.isUser ? "prose-invert" : ""}`} 
                            dir="auto"
                            style={{ 
                              maxWidth: '100%',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp and Copy Button */}
                      {!message.isThinking && (
                        <div className={`flex items-center gap-2 ${message.isUser ? "flex-row" : "flex-row-reverse"}`}>
                          <span className="text-[10px] text-slate-400 px-1">
                            {message.timestamp.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessageText(message.content)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                            title="העתק טקסט"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="שאל שאלה..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 text-sm shadow-none"
              disabled={isLoading}
              autoComplete="off"
            />

            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
              className={`h-8 w-8 rounded-xl transition-all ${
                inputMessage.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
