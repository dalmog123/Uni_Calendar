import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CalendarDays, BookOpen, Library, Calculator } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
      <div className="space-y-6 mb-16">
        <h1 className="text-5xl font-bold text-center">ברוכים הבאים ל-UniCalendar</h1>
        
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          המערכת המושלמת לניהול לוח הזמנים שלך באוניברסיטה הפתוחה
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            href: "/calendar",
            icon: CalendarDays,
            title: "לוח שנה",
            description: "נהל את לוח הזמנים שלך, מעקב אחר מטלות ומועדי מפגשים"
          },
          {
            href: "/syllabus",
            icon: BookOpen,
            title: "סילבוס",
            description: "צפה בתכנית הלימודים המלאה ומידע על הקורסים"
          },
          {
            href: "/materials",
            icon: Library,
            title: "חומרי לימוד",
            description: "גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים"
          },
          {
            href: "/calculator",
            icon: Calculator,
            title: "מחשבון עלות תואר",
            description: "חשב את העלות המוערכת שהתואר יעלה לך"
          }
        ].map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:shadow-lg transition-all hover:scale-102 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <item.icon className="h-6 w-6" />
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
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="https://chat.whatsapp.com/JBn7Fw4pq5o7pGD1ECV8zj" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform bg-[#25D366] hover:bg-[#128C7E]"
          >
            הצטרף לקבוצת הווצאפ
          </Button>
        </Link>
      </div>
    </div>
  )
}