import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  content: string
  isUser: boolean
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, image, history, systemPrompt } = await request.json()

    if (!message && !image) {
      return NextResponse.json(
        { error: "נדרשת הודעה או תמונה" },
        { status: 400 }
      )
    }

    if (!systemPrompt) {
      return NextResponse.json(
        { error: "נדרש system prompt" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROK_API_KEY
    if (!apiKey) {
      console.error("GROK_API_KEY not configured")
      return NextResponse.json(
        { error: "שגיאת תצורה בשרת" },
        { status: 500 }
      )
    }

    // Validate image input early to avoid sending unsupported files (e.g. PDFs) to the AI
    let imageMimeType: string | null = null
    if (image) {
      // Expect a data URL like: data:image/jpeg;base64,....
      const match = (image as string).match(/^data:([^;]+);base64,/i)
      if (!match) {
        return NextResponse.json(
          { error: "קובץ התמונה אינו בפורמט נתמך. אנא העלה תמונה (JPG/PNG/WEBP/GIF)." },
          { status: 400 }
        )
      }
      imageMimeType = match[1].toLowerCase()
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!allowed.includes(imageMimeType)) {
        return NextResponse.json(
          { error: "סוג הקובץ אינו נתמך. אנא העלה תמונה בפורמט JPG/PNG/WEBP/GIF (לא PDF)." },
          { status: 400 }
        )
      }
    }

    // Build messages array for Groq (OpenAI-compatible format)
    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = []

    // Add system prompt as first message with instruction to use plain text only (no tables, no HTML)
    messages.push({
      role: "system",
      content: `${systemPrompt}\n\nחשוב: כתוב תשובות בטקסט רגיל בלבד, כמו הודעת WhatsApp. אל תשתמש בטבלאות, אל תשתמש ב-HTML, ואל תשתמש בפורמט Markdown מורכב. כתוב הכל כטקסט פשוט וברור, עם שורות ריקות להפרדה בין נושאים. אם צריך להציג מידע מובנה, כתוב אותו כטקסט רגיל עם נקודות או מקפים.`
    })

    // Add conversation history
    if (history) {
      history.forEach((msg: ChatMessage) => {
        messages.push({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content + (msg.image ? '\n[Image uploaded]' : '')
        })
      })
    }

    // Build current user message content
    let userContent: string | Array<{ type: string; text?: string; image_url?: { url: string } }> = message || ""

    // If image is provided, use multimodal format
    if (image) {
      const base64Data = (image as string).split(',')[1] // Remove data URL prefix
      const dataUrl = `data:${imageMimeType || "image/jpeg"};base64,${base64Data}`
      
      userContent = [
        {
          type: "text",
          text: message || ""
        },
        {
          type: "image_url",
          image_url: {
            url: dataUrl
          }
        }
      ]
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userContent
    })

    // Helper function to make API request to a specific Groq model
    const makeModelRequest = async (modelName: string) => {
      // All models are non-reasoning, so use standard token limit
      const maxTokens = 2048
      
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
            temperature: 0.2,
            top_p: 0.7,
            max_completion_tokens: maxTokens,
            stream: false,
          }),
        }
      )
      return response
    }

    // Helper function to process response and extract text
    const processResponse = async (response: Response) => {
      if (!response.ok) {
        let errorMessage = "שגיאה בתקשורת עם מנוע ה-AI"
        try {
          const errorData = await response.text()
          console.error("Groq API Error:", errorData)
          if (errorData.startsWith("{")) {
            const jsonError = JSON.parse(errorData)
            if (jsonError.error?.message) {
              const rawMsg = jsonError.error.message as string
              if (/unable to process input image/i.test(rawMsg) || /vision/i.test(rawMsg)) {
                errorMessage = "הקובץ ששלחת אינו נתמך על ידי המנוע. העלה תמונה בפורמט JPG/PNG/WEBP/GIF במקום קבצים כמו PDF."
              } else {
                errorMessage = `שגיאת AI: ${rawMsg}`
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse error response:", e)
        }
        throw new Error(errorMessage)
      }

      let data
      try {
        const rawResponse = await response.text()
        console.log("Raw Groq response:", rawResponse)
        data = JSON.parse(rawResponse)
      } catch (e) {
        console.error("Failed to parse Groq response:", e)
        throw new Error("התקבלה תשובה לא תקינה מהשרת")
      }

      // Validate response structure (OpenAI-compatible format)
      const message = data?.choices?.[0]?.message
      if (!message) {
        console.error("Unexpected response structure:", data)
        throw new Error("מבנה התשובה מה-AI אינו תקין")
      }

      // Only use 'content' field - never use 'reasoning' as it contains internal thinking process
      // Reasoning models output both, but we only want the final answer in 'content'
      const fullResponse = message.content

      if (!fullResponse || fullResponse.trim() === '') {
        console.error("No content found in response:", {
          hasContent: !!message.content,
          hasReasoning: !!message.reasoning,
          finishReason: data?.choices?.[0]?.finish_reason
        })
        throw new Error("לא התקבלה תשובה מהשרת - המודל לא סיים ליצור תשובה")
      }

      return fullResponse.trim()
    }

    // Helper function to delay execution
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Model selection - using non-reasoning models only to avoid exposing internal thinking:
    // Primary: llama-3.1-8b-instant - Very fast (560 T/SEC), cheapest ($0.05/$0.08), best for free tier, non-reasoning
    // Fallback 1: llama-3.3-70b-versatile - More powerful (280 T/SEC), moderate cost ($0.59/$0.79), non-reasoning
    // Fallback 2: llama-3.1-8b-instant - Same as primary (retry with delay)
    const primaryModel = "llama-3.1-8b-instant"
    const fallbackModel1 = "llama-3.3-70b-versatile"
    const fallbackModel2 = "llama-3.1-8b-instant"
    const retryDelayMs = 3000 // Wait 3 seconds before fallback

    // Try primary model first, then fallbacks on any error
    try {
      const startTime = Date.now()
      console.log(`[GROQ] Attempting request with primary model: ${primaryModel}`)
      const response = await makeModelRequest(primaryModel)
      const fullResponse = await processResponse(response)
      console.log(`[GROQ] Primary model succeeded in ${Date.now() - startTime}ms`)
      return NextResponse.json({ 
        response: fullResponse
      })
    } catch (error) {
      // Primary model failed, try first fallback after delay
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.log(`[GROQ] Primary model failed: ${errorMessage}`)
      console.log(`[GROQ] Waiting ${retryDelayMs}ms (${retryDelayMs/1000}s) before trying fallback 1: ${fallbackModel1}`)
      
      const delayStartTime = Date.now()
      await delay(retryDelayMs)
      const actualDelay = Date.now() - delayStartTime
      console.log(`[GROQ] Delay completed. Actual delay: ${actualDelay}ms (expected: ${retryDelayMs}ms)`)

      try {
        const fallbackStartTime = Date.now()
        console.log(`[GROQ] Attempting request with fallback model 1: ${fallbackModel1}`)
        const fallbackResponse = await makeModelRequest(fallbackModel1)
        const fullResponse = await processResponse(fallbackResponse)
        console.log(`[GROQ] Fallback model 1 succeeded in ${Date.now() - fallbackStartTime}ms`)
        return NextResponse.json({ 
          response: fullResponse
        })
      } catch (fallbackError1) {
        // First fallback failed, try second fallback
        const fallbackErrorMessage1 = fallbackError1 instanceof Error 
          ? fallbackError1.message 
          : "שגיאה בתקשורת עם השרת"
        console.log(`[GROQ] Fallback model 1 failed: ${fallbackErrorMessage1}`)
        console.log(`[GROQ] Waiting ${retryDelayMs}ms before trying fallback 2: ${fallbackModel2}`)
        
        await delay(retryDelayMs)
        
        try {
          const fallbackStartTime2 = Date.now()
          console.log(`[GROQ] Attempting request with fallback model 2: ${fallbackModel2}`)
          const fallbackResponse2 = await makeModelRequest(fallbackModel2)
          const fullResponse = await processResponse(fallbackResponse2)
          console.log(`[GROQ] Fallback model 2 succeeded in ${Date.now() - fallbackStartTime2}ms`)
          return NextResponse.json({ 
            response: fullResponse
          })
        } catch (fallbackError2) {
          // All models failed, return error
          const fallbackErrorMessage2 = fallbackError2 instanceof Error 
            ? fallbackError2.message 
            : "שגיאה בתקשורת עם השרת"
          console.error(`[GROQ] All models failed. Last error: ${fallbackErrorMessage2}`)
          return NextResponse.json(
            { error: fallbackErrorMessage2 },
            { status: 500 }
          )
        }
      }
    }
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: "שגיאת שרת פנימית" },
      { status: 500 }
    )
  }
}
