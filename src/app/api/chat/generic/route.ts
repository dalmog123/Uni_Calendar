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

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured")
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

    // Create conversation history string
    const conversationContext = history
      ? history
          .map((msg: ChatMessage) => 
            `${msg.isUser ? 'User' : 'AI'}: ${msg.content}${
              msg.image ? '\n[Image uploaded]' : ''
            }`
          )
          .join('\n\n')
      : ''

    // Add parts array for the request
    const parts: any[] = []

    // Add image part if provided
    if (image) {
      const base64Data = (image as string).split(',')[1] // Remove data URL prefix
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: imageMimeType || "image/jpeg"
        }
      })
    }

    // Add text part with conversation history
    const promptWithContext = `${systemPrompt}

Previous conversation:
${conversationContext}

שאלת המשתמש: ${message}`

    parts.push({
      text: promptWithContext
    })

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts
              }
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 20,
              topP: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      )

      if (!response.ok) {
        let errorMessage = "שגיאה בתקשורת עם מנוע ה-AI"
        try {
          const errorData = await response.text()
          console.error("Gemini API Error:", errorData)
          if (errorData.startsWith("{")) {
            const jsonError = JSON.parse(errorData)
            if (jsonError.error?.message) {
              const rawMsg = jsonError.error.message as string
              if (/unable to process input image/i.test(rawMsg)) {
                errorMessage = "הקובץ ששלחת אינו נתמך על ידי המנוע. העלה תמונה בפורמט JPG/PNG/WEBP/GIF במקום קבצים כמו PDF."
              } else {
                errorMessage = `שגיאת AI: ${rawMsg}`
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse error response:", e)
        }
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        )
      }

      let data
      try {
        const rawResponse = await response.text()
        console.log("Raw Gemini response:", rawResponse)
        data = JSON.parse(rawResponse)
      } catch (e) {
        console.error("Failed to parse Gemini response:", e)
        return NextResponse.json(
          { error: "התקבלה תשובה לא תקינה מהשרת" },
          { status: 500 }
        )
      }

      // Validate response structure
      if (!data?.candidates?.[0]?.content?.parts?.[0]) {
        console.error("Unexpected response structure:", data)
        return NextResponse.json(
          { error: "מבנה התשובה מה-AI אינו תקין" },
          { status: 500 }
        )
      }

      const fullResponse = data.candidates[0].content.parts[0].text

      if (!fullResponse) {
        return NextResponse.json(
          { error: "לא התקבלה תשובה מהשרת" },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        response: fullResponse.trim()
      })
    } catch (fetchError) {
      console.error("Gemini API Fetch Error:", fetchError)
      return NextResponse.json(
        { error: "שגיאה בתקשורת עם השרת" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: "שגיאת שרת פנימית" },
      { status: 500 }
    )
  }
}
