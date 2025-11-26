import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  content: string
  isUser: boolean
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, image, history } = await request.json()

    if (!message && !image) {
      return NextResponse.json(
        { error: "נדרשת הודעה או תמונה" },
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

    // Create a specialized prompt for accounting students
    const systemPrompt = `אתה סוכן AI ברמת מומחה ומורה לחשבונאות עם 20+ שנות ניסיון. מטרתך: להסביר בצורה בהירה, תמציתית ומעשית לכל סטודנט, בהתאם לרמתו.

    כללי עבודה:
לענות רק בעברית תקנית וברורה.
להתמקד אך ורק בנושאי חשבונאות: פיננסית, ניהולית, IFRS, ביקורת, מיסוי ישראלי, פתרון תרגילים.
לכתוב בטון סבלני ומלמד, עם דוגמאות פרקטיות מהעולם הישראלי.
בפתרון תרגילים: חלוקה לשלבים ברורים.
בכל תשובה: עד 600 מילים, בלי יותר משורה ריקה אחת.
6 שאלות המשך בסוף כל תשובה.

הנחיות מקצועיות:
בפקודות יומן: שימוש עקבי בחובה/זכות, עם הפרדה מדויקת בין רכיבים (למשל: קרן וריבית).
אסור להשתמש בז'רגון לא מוסבר, או לסטות מתחום החשבונאות.
אין לבקש מידע נוסף אלא אם נחוץ לפתרון.
אין צורך לומר שלום בכל הודעה (רק בפתיחת שיחה).
תהליך חשיבה (פנימי):

הבנת השאלה → זיהוי התחום → פירוק לשלבים → שימוש בדוגמאות → ניסוח תמציתי ובהיר → התייחסות לבלבולים נפוצים → שאלות המשך.
 
לאחר כל תשובה, הצע 6 שאלות המשך רלוונטיות בפורמט הבא:
    --- שאלות המשך מוצעות ---
    1. [שאלה 1]
    2. [שאלה 2]
    3. [שאלה 3]
    4. [שאלה 4]
    5. [שאלה 5]
    6. [שאלה 6]`

    // Create conversation history string
    const conversationContext = history
      ? history
          .map((msg: ChatMessage) => 
            `${msg.isUser ? 'Student' : 'AI'}: ${msg.content}${
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
    }    // Add text part with conversation history
    const promptWithContext = `${systemPrompt}

Previous conversation:
${conversationContext}

שאלת הסטודנט: ${message}`

    parts.push({
      text: promptWithContext
    })
//gemma-3-12b-it
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      )

      if (!response.ok) {
        let errorMessage = "שגיאה בתקשורת עם מנוע ה-AI"
        try {
          const errorData = await response.text() // Use text() instead of json()
          console.error("Gemini API Error:", errorData)
          // Only try to parse as JSON if it looks like JSON
          if (errorData.startsWith("{")) {
            const jsonError = JSON.parse(errorData)
            if (jsonError.error?.message) {
              // Hide internal AI messages about unsupported files and return a friendly message
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
        const rawResponse = await response.text() // First get as text
        console.log("Raw Gemini response:", rawResponse) // Log the raw response
        data = JSON.parse(rawResponse) // Then parse as JSON
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
      }      let answer = fullResponse

      // Split the response into answer and suggested questions
      const [finalAnswer, questionsPart] = answer.split("--- שאלות המשך מוצעות ---")
      
      // Parse suggested questions
      const suggestedQuestions = questionsPart
        ? questionsPart
            .trim()
            .split("\n")
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
            .filter((q: string) => q)
        : []

      return NextResponse.json({ 
        response: finalAnswer.trim(),
        suggestedQuestions: suggestedQuestions.length === 6 ? suggestedQuestions : undefined
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
