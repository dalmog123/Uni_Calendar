import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CalendarDays, BookOpen, Library, Calculator, Users, Recycle, MapPin, Briefcase } from "lucide-react"
import { BsWhatsapp } from "react-icons/bs"

export default function Home() {
  return (
    <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
      <div className="space-y-6 mb-16">
        <h1 className="text-5xl font-bold text-center">ברוכים הבאים ל-UniCalendar</h1>
        
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          המערכת המושלמת לסטודנטים לחשבונאות באוניברסיטה הפתוחה
        </p>
      </div>

      <div className="mb-16 text-center">
        <Link 
          href="https://chat.whatsapp.com/JBn7Fw4pq5o7pGD1ECV8zj" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform bg-[#25D366] hover:bg-[#128C7E] flex items-center gap-2"
          >
            <BsWhatsapp className="h-6 w-6" />
            הצטרף לקבוצת ה WhatsApp
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          {
            id: "calendar",
            href: "/calendar",
            icon: CalendarDays,
            title: "לוח שנה",
            description: "הוספת מועדי מפגשים ומטלות ללוח השנה שלך",
            disabled: false
          },
          {
            id: "syllabus",
            href: "/syllabus",
            icon: BookOpen,
            title: "סילבוס",
            description: "צפייה בתכנית הלימודים המלאה ומידע על הקורסים",
            disabled: false
          },
          {
            id: "materials",
            href: "/materials",
            icon: Library,
            title: "חומרי לימוד",
            description: "גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים",
            disabled: false
          },
          {
            id: "calculator",
            href: "/calculator",
            icon: Calculator,
            title: "מחשבון עלות תואר",
            description: "לחישוב העלות המוערכת שהתואר יעלה לך",
            disabled: false
          },
          {
            id: "study-together",
            href: "#",
            icon: Users,
            title: "ללמוד ביחד",
            description: "למציאת סטודנטים ללימוד משותף בקורסים שלך (בקרוב)",
            disabled: true
          },
          {
            id: "recycle-books",
            href: "#",
            icon: Recycle,
            title: "שומרים על הכדור",
            description: "לתרומת ספרי לימוד משומשים לסטודנטים אחרים (בקרוב)",
            disabled: true
          },
          {
            id: "exam-centers",
            href: "#",
            icon: MapPin,
            title: "מרכזי בחינות",
            description: "מידע על מרכזי לימוד, דרכי הגעה, חניה ותחבורה ציבורית (בקרוב)",
            disabled: true
          },
          {
            id: "career",
            href: "#",
            icon: Briefcase,
            title: "קריירה",
            description: "משרות סטודנטים, התמחויות ומידע שימושי על אופציות תעסוקה (בקרוב)",
            disabled: true
          }
        ].map((item) => (
          <div key={item.id}>
            {item.disabled ? (
              <div className="opacity-50 cursor-not-allowed h-full">
                <Card className="h-full">
                  <CardHeader className="h-24 flex items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Link href={item.href} className="block h-full">
                <Card className="h-full hover:shadow-lg transition-all hover:scale-102">
                  <CardHeader className="h-24 flex items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}