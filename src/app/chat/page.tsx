"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalculationCanvas } from "@/components/ui/calculation-canvas"
import {
  Bot,
  User,
  Loader2,
  Sparkles,
  Lightbulb,
  ChevronDown,
  Paperclip,
  X,
  Image as ImageIcon,
  ArrowUp
} from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  calculationData?: {
    title: string
    data: { value: string | number; formula?: string }[][]
  }
  isThinking?: boolean
  image?: string
}

const DEFAULT_QUESTIONS = [
  "מה זה עקרון ההכרה בהכנסות?",
  "איך מחשבים פחת שנתי?",
  "מה ההבדל בין עלות היסטורית לערך הוגן?",
  "הסבר לי על מאזן חשבונאי",
  "איך עובד חישוב מס חברות?",
  "מה זה ביקורת פנימית?",
]

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
      "שלום וברכה! 👋\n\nאני המורה AI שלך לחשבונאות 🤖\n\nאני כאן לעזור לך עם:\n\n• הסבר מושגים בחשבונאות 📚\n\n• פתרון תרגילים צעד אחר צעד 🎯\n\n• הכנה לבחינות 📝\n\n• תקני IFRS וחוקי מס ישראליים 📊\n\nמה תרצה ללמוד היום? ✨",
    isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_QUESTIONS)
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Improved scroll function that targets the viewport specifically
  // avoiding parent (body) scroll issues
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // We need to target the actual viewport element inside Radix ScrollArea
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      
      if (scrollViewport) {
        scrollViewport.scrollTo({
          top: scrollViewport.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }

  // Scroll when messages change or when the questions drawer toggles
  useEffect(() => {
    // Small timeout allows the DOM/Layout to update (especially for the questions drawer animation)
    // before we scroll to bottom
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isQuestionsExpanded])

  const sendMessage = async (content: string) => {
    if ((!content.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      image: selectedImage || undefined,
    }

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "אני חושב על התשובה...",
      isUser: false,
      timestamp: new Date(),
      isThinking: true,
    }

    setMessages((prev) => [...prev, userMessage, thinkingMessage])
    setInputMessage("")
    setIsLoading(true)
    clearSelectedImage()
    
    // Collapse questions when conversation starts
    setIsQuestionsExpanded(false)

    try {
      const history = messages
        .filter(msg => !msg.isThinking)
        .map(msg => ({
          content: msg.content,
          isUser: msg.isUser,
          image: msg.image
        }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content,
          image: selectedImage,
          history 
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
        calculationData: data.calculationData,
      }

      setMessages((prev) => [...prev, aiMessage])
      
      if (data.suggestedQuestions?.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions)
      }
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
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() && !selectedImage) return
    sendMessage(inputMessage.trim())
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 relative overflow-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-purple-100/40 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3]" />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col p-2 sm:p-4 gap-4 h-full min-h-0">
        
        {/* Chat Area */}
        <Card className="flex-1 border-0 shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col relative h-full min-h-0">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-white/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">המורה AI</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-slate-500 font-medium">מחובר וערוך לעזור</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setMessages([{
                  id: "welcome",
                  content: "היי! אני כאן מחדש. איך אפשר לעזור? 🌟",
                  isUser: false,
                  timestamp: new Date(),
                }]);
                setSuggestedQuestions(DEFAULT_QUESTIONS);
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="sr-only">נקה שיחה</span>
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages List */}
          <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full w-full p-3 sm:p-4" ref={scrollAreaRef}>
                <div className="space-y-6 pb-4 pr-2 pl-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full ${message.isUser ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`flex gap-3 max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ${message.isUser ? "flex-row" : "flex-row-reverse"}`}>
                      
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
                      <div className={`flex flex-col gap-1 ${message.isUser ? "items-start" : "items-end"}`}>
                        <div
                          className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                            message.isUser
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : message.isThinking
                              ? "bg-slate-50 border border-slate-200 text-slate-500 rounded-tl-none flex items-center gap-2"
                              : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                          }`}
                        >
                          {message.isThinking ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{message.content}</span>
                            </>
                          ) : (
                            <>
                              {message.image && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                                  <img
                                    src={message.image}
                                    alt="Uploaded content"
                                    className="max-w-full max-h-[200px] object-cover"
                                  />
                                </div>
                              )}
                              <div className={`prose prose-sm max-w-none ${message.isUser ? "prose-invert" : ""}`} dir="auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                              {message.calculationData && (
                                <div className="mt-4 not-prose">
                                  <CalculationCanvas
                                    title={message.calculationData.title}
                                    data={message.calculationData.data}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* Timestamp */}
                        {!message.isThinking && (
                          <span className="text-[10px] text-slate-400 px-1">
                            {message.timestamp.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Spacer for scrolling */}
                <div className="h-2" />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area Container */}
          <div className="p-4 bg-white border-t border-slate-100 relative z-20 shrink-0">
            
            {/* Suggestions - Using CSS Grid for smooth height animation */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Lightbulb className="h-3 w-3" />
                  שאלות נפוצות
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isQuestionsExpanded ? "rotate-180" : ""}`} />
                </button>
              </div>
              
              <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isQuestionsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pb-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-right text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all truncate"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Image Preview */}
            {selectedImage && (
              <div className="absolute bottom-20 right-6 z-30 animate-in zoom-in-95 duration-200">
                <div className="relative group">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-24 w-24 object-cover rounded-xl border-2 border-white shadow-lg ring-2 ring-blue-100"
                  />
                  <button
                    onClick={clearSelectedImage}
                    className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
              {/* File Upload */}
              <div className="flex items-center pb-1 pr-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all hidden sm:flex"
                  disabled
                >
                  {/* <Paperclip className="h-5 w-5" /> */}
                </Button>
              </div>

              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="שאל שאלה על חשבונאות..."
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-3 min-h-[48px] max-h-[120px] text-base shadow-none"
                disabled={isLoading}
                autoComplete="off"
              />

              <div className="pb-1 pl-1">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                  className={`h-10 w-10 rounded-2xl transition-all duration-300 shadow-sm ${
                    inputMessage.trim() || selectedImage
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-md" 
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">
                UniCalendar AI יכול לעשות טעויות. מומלץ לבדוק מידע חשוב.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}