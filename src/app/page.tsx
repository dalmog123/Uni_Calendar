import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  CalendarDays,
  BookOpen,
  Library,
  Calculator,
  TimerIcon,
  Users,
  Recycle,
  MapPin,
  Briefcase,
  ExternalLink,
} from "lucide-react"
import { BsWhatsapp } from "react-icons/bs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-2 sm:px-4 pt-16 pb-12 max-w-7xl">
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold leading-tight md:space-y-2">
              <div className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent sm:whitespace-nowrap">
                ברוכים הבאים ל-
              </div>
              <div className="font-bold bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                UniCalendar
              </div>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            המערכת המושלמת לסטודנטים לחשבונאות באוניברסיטה הפתוחה
          </p>

          <div className="pt-8">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfBZS2QAt6jeDXFKRP2vik0Nl3iav9Em9B_nO7YEZswI-ZqpA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                className="text-lg sm:text-xl px-6 py-6 sm:px-10 sm:py-8 rounded-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] shadow-lg hover:shadow-xl flex items-center gap-2 sm:gap-3 border-0"
              >
                <BsWhatsapp className="h-5 w-5 sm:h-7 sm:w-7" />
                הצטרף לקבוצת ה WhatsApp
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 items-stretch">
          {[
            {
              id: "calendar",
              href: "/calendar",
              icon: CalendarDays,
              title: "לוח שנה",
              description: "הוספת מועדי מפגשים ומטלות ללוח השנה שלך",
              disabled: false,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              id: "syllabus",
              href: "/syllabus",
              icon: BookOpen,
              title: "סילבוס",
              description: "צפייה בתכנית הלימודים המלאה ומידע על הקורסים",
              disabled: false,
              gradient: "from-purple-500 to-pink-500",
            },
            {
              id: "materials",
              href: "/materials",
              icon: Library,
              title: "חומרי לימוד",
              description: "גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים",
              disabled: false,
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              id: "calculator",
              href: "/calculator",
              icon: Calculator,
              title: "מחשבון עלות תואר",
              description: "לחישוב העלות המוערכת שהתואר יעלה לך",
              disabled: false,
              gradient: "from-orange-500 to-red-500",
            },
            {
              id: "timer",
              href: "/timer",
              icon: TimerIcon,
              title: "טיימר לימודים",
              description: "טיימר למבחנים ולמידה שישפר לכם את הפוקוס ",
              disabled: false,
              gradient: "from-violet-500 to-purple-500",
              isNew: true,
            },
            {
              id: "study-together",
              href: "#",
              icon: Users,
              title: "ללמוד ביחד",
              description: "למציאת סטודנטים ללימוד משותף בקורסים שלך (בקרוב)",
              disabled: true,
              gradient: "from-indigo-500 to-purple-500",
            },
            {
              id: "recycle-books",
              href: "#",
              icon: Recycle,
              title: "שומרים על הכדור",
              description: "לתרומת ספרי לימוד משומשים לסטודנטים אחרים (בקרוב)",
              disabled: true,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              id: "exam-centers",
              href: "#",
              icon: MapPin,
              title: "מרכזי בחינות",
              description: "מידע על מרכזי לימוד, דרכי הגעה, חניה ותחבורה ציבורית (בקרוב)",
              disabled: true,
              gradient: "from-rose-500 to-pink-500",
            },
            {
              id: "career",
              href: "#",
              icon: Briefcase,
              title: "קריירה",
              description: "משרות סטודנטים, התמחויות ומידע שימושי על אופציות תעסוקה (בקרוב)",
              disabled: true,
              gradient: "from-amber-500 to-orange-500",
            },
          ].map((item) => (
            <div key={item.id} className="group h-full flex">
              {item.disabled ? (
                <div className="relative w-full">
                  <Card className="h-full bg-white/60 backdrop-blur-sm border-slate-200 transition-all duration-300 flex flex-col">
                    <CardHeader className="pb-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-slate-300 flex items-center justify-center mb-4 mx-auto">
                        <item.icon className="h-8 w-8 text-slate-500" />
                      </div>
                      <CardTitle className="text-xl text-center text-slate-400">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex-grow flex items-center">
                      <p className="text-slate-400 text-center leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                  <div className="absolute top-4 left-4 bg-slate-500 text-white text-xs px-2 py-1 rounded-full">
                    בקרוב
                  </div>
                </div>
              ) : (
                <div className="relative w-full">
                  <Link href={item.href} className="block h-full w-full">
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 group-hover:border-slate-300 flex flex-col">
                      <CardHeader className="pb-4 flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl text-center text-slate-800 group-hover:text-slate-900">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 flex-grow flex items-center">
                        <p className="text-slate-600 text-center leading-relaxed group-hover:text-slate-700">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  {item.isNew && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white transform rotate-12 hover:rotate-0 transition-transform duration-300">
                        חדש
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Useful Links Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">קישורים שימושיים</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                href: "https://www.openu.ac.il/registration/sesoneanddates/pages/default.aspx",
                text: "מידע על תקופות הרשמה ומועדי הרשמה",
              },
              {
                href: "https://www.openu.ac.il/registration/payments/tables/pages/default.aspx",
                text: "טבלאות שכר לימוד ותשלומים",
              },
              {
                href: "https://www.openu.ac.il",
                text: "האוניברסיטה הפתוחה",
              },
              {
                href: "https://www.openu.ac.il/dean-students/scholarships/pages/default.aspx",
                text: "מלגות",
              },
              {
                href: "https://www.bpracti.co.il/cpa-salary-survey/",
                text: "סקר שכר רואי חשבון",
              },
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-700 group-hover:text-slate-900 font-medium">{link.text}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
