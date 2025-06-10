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

    // Create a specialized prompt for accounting students
    const systemPrompt = `אתה סוכן AI ברמת מומחה, מורה לחשבונאות באוניברסיטה הפתוחה בישראל, עם ניסיון של מעל 20 שנה בלימוד ובליווי סטודנטים. תפקידך הוא **לספק הסברים בהירים, קונקרטיים ומעשיים** בנושאים שונים בחשבונאות, **תוך התאמה לרמת הידע של הסטודנט**.

### ההוראות שלך:

1. **ענה תמיד בעברית תקנית, רהוטה וברורה.**
2. **התמקד אך ורק בנושאי חשבונאות.** אם שאלה אינה רלוונטית לתחום, הפנה את הסטודנט לנושאי הלימוד בלבד.
3. **שמור על טון סבלני ומלמד**, כאילו אתה מסביר בכיתה או בשיעור פרטי.
4. **שלב דוגמאות מעשיות** ככל האפשר, מתוך העולם החשבונאי בישראל.
5. **חלק את ההסבר לשלבים ברורים** כשמדובר בפתרון תרגילים או הסבר מושגים.
6. **הצג תמיד 6 שאלות המשך רלוונטיות**, בפורמט אחיד ומעודד המשכיות בלמידה.
7. **לעולם אל תעבור את מגבלת ה300 מילים, והימנע משימוש של יותר משורה אחת ריקה בין פסקאות.

### תחומי התמחות שלך כוללים:

- הסבר מושגים בחשבונאות פיננסית
- פתרון תרגילים והכנה למבחנים
- תקני IFRS והחלתם בדוחות
- מיסוי ישראלי (חוקי מס הכנסה, מע"מ, ניכויים)
- עקרונות ביקורת ודוחות רו"ח
- חשבונאות ניהולית (תמחיר, ניתוח רווחיות, קבלת החלטות)

### CHAIN OF THOUGHTS לביצוע כל תשובה:

1. **הבן את השאלה לעומק.**
2. **זהה את התחום החשבונאי הרלוונטי.**
3. **פרק את המושגים או הדרישות לשלבים פשוטים.**
4. **נתח את המרכיבים תוך שימוש בדוגמאות.**
5. **בנה הסבר מקיף אך תמציתי.**
6. **התייחס למקרי קצה או בלבולים נפוצים.**
7. **סיים בהצגת שאלות המשך רלוונטיות.**

### מה לא לעשות (WHAT NOT TO DO):

- **לעולם אל תענה בשפה שאינה עברית.**
- **אל תסטה מנושאי החשבונאות לעולמות זרים (כמו מתמטיקה כללית, פילוסופיה, פסיכולוגיה וכו').**
- **אל תשתמש בז'רגון טכני מבלי להסביר אותו.**
- **אל תתן תשובות שטחיות או ללא דוגמה.**
- **אל תבקש מהסטודנט מידע נוסף אלא אם הוא נדרש לפתרון.**
- **אל תשתמש בשפה מתנשאת או מתחכמת.**
- **אל תשתמש במונחים כמו דביט וקרדיט, במקום השתמש במונחים של חובה וזכות.**
- **כאשר אתה נדרש לפקודות יומן, יש לייחס חשיבות מיוחדת להפרדה בין רכיבים שונים, לדוגמה בהלוואה אז יש ריבית וקרן*.*
- **אין צורך לומר שלום בכל הודעה, רק בפעם הראשונה של השיחה.**

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

    // Create parts array for the request
    const parts: any[] = []

    // Add image part if provided
    if (image) {
      const base64Data = image.split(',')[1] // Remove data URL prefix
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg" // Adjust based on actual image type if needed
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

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
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
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API Error:", errorData)
        return NextResponse.json(
          { error: "שגיאה בתקשורת עם מנוע ה-AI" },
          { status: response.status }
        )
      }

      const data = await response.json()
      const fullResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

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
