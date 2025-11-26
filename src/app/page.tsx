import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
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
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Cpu,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden relative" dir="rtl">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-200/30 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12 max-w-7xl">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900">
              הכלים שלך <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                להצלחה בתואר
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              UniCalendar מרכזת עבורך את כל הכלים, החישובים והמידע לסטודנטים לחשבונאות באוניברסיטה הפתוחה במקום אחד חכם.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/materials">
              <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1">
                התחל ללמוד <Library className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/syllabus">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl bg-white/50 hover:bg-white border-slate-200 backdrop-blur-sm transition-all duration-300">
                צפה בסילבוס <BookOpen className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24 auto-rows-[180px]">
          
          {/* Calendar - Large Block */}
          <div className="group md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-sm opacity-80 cursor-not-allowed transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">קורסים</h3>
                  <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600 inline-block">בקרוב</span>
                </div>
                <p className="text-slate-500 text-lg">קורסים מוקלטים להעמקה ולמידה עצמאית בנושאים שונים.</p>
              </div>
              <div className="absolute bottom-8 left-8 opacity-60">
                <ArrowLeft className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* AI Chat - Highlighted */}
          <Link href="/chat" className="group md:col-span-2 lg:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">חדש</div>
            <div className="p-6 h-full flex flex-col items-center text-center justify-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <Cpu className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">AI Tutor</h3>
              <p className="text-emerald-700/80">עוזר אישי חכם לפתרון תרגילים והסבר מושגים 24/7.</p>
            </div>
          </Link>

          {/* Calendar (small card) */}
          <Link href="/calendar" className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-auto">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">לוח שנה חכם</h3>
              <p className="text-sm text-slate-500">תכנון ויזואלי של הסמסטר   הוספת מועדי מפגשים ומטלות בקליק</p>
            </div>
          </Link>

          {/* Materials */}
          <Link href="/materials" className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-auto">
                <Library className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">חומרי לימוד</h3>
              <p className="text-sm text-slate-500">סיכומים ומבחנים</p>
            </div>
          </Link>

          {/* Calculator */}
          <Link href="/calculator" className="group md:col-span-1 relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-auto">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">מחשבון עלות</h3>
              <p className="text-sm text-slate-500">תכנון תקציב התואר</p>
            </div>
          </Link>

          {/* Timer */}
          <Link href="/timer" className="group md:col-span-1 relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-auto">
                <TimerIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">טיימר פוקוס</h3>
              <p className="text-sm text-slate-500">שיטת פומודורו</p>
            </div>
          </Link>

          {/* Coming Soon Items - Smaller / Grayed out style but interactive feel */}
          {[
            { icon: Users, title: "ללמוד ביחד", color: "bg-pink-100 text-pink-600" },
            { icon: MapPin, title: "מרכזי בחינות", color: "bg-yellow-100 text-yellow-600" },
          ].map((item, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-not-allowed">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-700">{item.title}</h3>
                <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600 mt-1 inline-block">בקרוב</span>
              </div>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white shadow-2xl mb-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 p-20 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-right">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                אל תלמדו לבד. <br/>
                <span className="text-blue-400">הצטרפו לקהילה שלנו.</span>
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl">
                קהילת הסטודנטים לחשבונאות הגדולה ביותר באוניברסיטה הפתוחה. טיפים, סיכומים, ותמיכה הדדית שמחכה רק לכם.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfBZS2QAt6jeDXFKRP2vik0Nl3iav9Em9B_nO7YEZswI-ZqpA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-14 px-8 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-green-900/20 border-0">
                    <BsWhatsapp className="w-6 h-6 ml-2" />
                    הצטרפות לקבוצה
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              {/* Decorative Community visual could go here */}
              <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full opacity-20 blur-3xl absolute animate-pulse"></div>
              <Users className="w-40 h-40 text-slate-700/30 relative z-10" />
            </div>
          </div>
        </div>

        {/* Quick Links - Minimal Design */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-800">קישורים שימושיים</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { text: "מועדי הרשמה ללימודים", href: "https://www.openu.ac.il/registration/sesoneanddates/pages/default.aspx" },
              { text: "טבלאות שכר לימוד", href: "https://www.openu.ac.il/registration/payments/tables/pages/default.aspx" },
              { text: "מלגות", href: "https://www.openu.ac.il/dean-students/scholarships/pages/default.aspx" },
              { text: "סקר שכר רואי חשבון", href: "https://www.bpracti.co.il/cpa-salary-survey/" },
              { text: "לוח שנה אקדמי", href: "https://academic.openu.ac.il/yedion/timetable/pages/default.aspx" },
              { text: "הסבר למועצה", href: "https://docs.google.com/document/d/1yiejclylhHa5wPqqHXqz1J2uBOGp25ky48uYsYSvRWU/edit?tab=t.0" },
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center h-full"
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
                  <ExternalLink className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium text-slate-700">{link.text}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}