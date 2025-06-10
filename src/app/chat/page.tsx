"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalculationCanvas } from "@/components/ui/calculation-canvas"
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Calculator,
  TrendingUp,
  FileText,
  Lightbulb,
  MessageCircle,
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
      "שלום ובברכה! 👋\n\nאני המורה AI שלך לחשבונאות 🤖\n\nאני כאן לעזור לך עם:\n• הסבר מושגים בחשבונאות 📚\n• פתרון תרגילים צעד אחר צעד 🎯\n• הכנה לבחינות 📝\n• תקני IFRS וחוקי מס ישראליים 📊\n\nמה תרצה ללמוד היום? ✨",
    isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_QUESTIONS)
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }

  // Scroll when messages change
  useEffect(() => {
    // Use a small delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Also scroll when the suggested questions expand/collapse
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [isQuestionsExpanded]);

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
      content: "חושב...",
      isUser: false,
      timestamp: new Date(),
      isThinking: true,
    }

    setMessages((prev) => [...prev, userMessage, thinkingMessage])
    setInputMessage("")
    setIsLoading(true)
    clearSelectedImage()
    
    // Scroll after adding the thinking message
    setTimeout(scrollToBottom, 100);

    try {
      // Prepare conversation history
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

      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => !msg.isThinking))

      // If response is not ok, throw an error with the error message from the server
      if (!response.ok) {
        throw new Error(data.error || "שגיאה בתקשורת עם השרת")
      }

      // Validate response structure
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

      setMessages((prev) => [...prev.filter((msg) => !msg.isThinking), aiMessage])
      
      // Safely update suggested questions if they exist
      if (data.suggestedQuestions?.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions)
      }
    } catch (error) {
      // Remove thinking message
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
      setMessages((prev) => [...prev.filter((msg) => !msg.isThinking), errorMessage])
    } finally {
      setIsLoading(false)
      // Scroll after the response is received
      setTimeout(scrollToBottom, 100);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) return

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <Card className="mx-auto max-w-[95%] md:max-w-4xl lg:max-w-6xl rounded-3xl border-0 bg-white shadow-lg min-h-[calc(100vh-1rem)] my-2">
        <CardHeader className="flex flex-col gap-1 text-center py-2">
          <CardTitle className="text-xl font-bold text-slate-800">
            המורה AI לחשבונאות
          </CardTitle>
          <p className="text-sm text-slate-500">
            שימו לב! מדובר במודל נסיוני, בעקבות העומס לוקח זמן לקבלת תשובה. אין להסתמך על התשובות!
          </p>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100vh-8rem)] p-2 md:p-3">
          <ScrollArea
            className="flex-grow rounded-lg border border-slate-200 bg-slate-50/50 p-2 mb-3"
            ref={scrollAreaRef}
          >
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-start" : "justify-end"} text-right`}
                >
                  <div
                    className={`flex w-full md:w-[85%] items-start gap-2 ${
                      message.isUser ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}
                    >
                      {message.isUser ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl px-3 py-2 ${
                        message.isUser
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                          : message.isThinking
                          ? "bg-slate-100 text-slate-600 animate-pulse"
                          : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <img
                            src={message.image}
                            alt="Uploaded content"
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                      )}
                      <div
                        className="whitespace-pre-wrap leading-relaxed text-right prose prose-sm max-w-none"
                        style={{ direction: "rtl", unicodeBidi: "plaintext" }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                      {message.calculationData && (
                        <div className="mt-2 overflow-hidden">
                          <CalculationCanvas
                            title={message.calculationData.title}
                            data={message.calculationData.data}
                          />
                        </div>
                      )}
                      <div
                        className={`text-[10px] mt-1 ${
                          message.isUser ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("he-IL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="space-y-3 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {selectedImage && (
                <div className="relative w-full">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-20 object-contain rounded border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-slate-600 px-3 py-1.5 text-white shadow-md transition-all duration-200 ease-in-out hover:bg-slate-700"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="מה השאלה שלך?"
                  className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-white shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>

            <div className="relative">
              <Button
                onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                className="w-full rounded-lg bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-all duration-200 ease-in-out hover:bg-slate-200 flex items-center justify-between"
              >
                <span>שאלות מוצעות</span>
                <span className={`transform transition-transform ${isQuestionsExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </Button>
              {isQuestionsExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-all duration-200 ease-in-out hover:bg-slate-200 text-sm h-auto whitespace-normal text-right"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
