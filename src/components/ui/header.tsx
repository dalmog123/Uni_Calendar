"use client"

import { Button } from "./button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, BookOpen, Library, Calculator, Menu, Home, TimerIcon, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "דף הבית", gradient: "from-blue-500 to-cyan-500" },
    { href: "/calendar", icon: CalendarDays, label: "לוח שנה", gradient: "from-blue-500 to-cyan-500" },
    { href: "/syllabus", icon: BookOpen, label: "סילבוס", gradient: "from-purple-500 to-pink-500" },
    { href: "/materials", icon: Library, label: "חומרי לימוד", gradient: "from-emerald-500 to-teal-500" },
    { href: "/calculator", icon: Calculator, label: "מחשבון עלות", gradient: "from-orange-500 to-red-500" },
    { href: "/timer", icon: TimerIcon, label: "טיימר", gradient: "from-violet-500 to-purple-500", isNew: true },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">UC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                UniCalendar
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-slate-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      pathname === item.href
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
                {item.isNew && (
                  <div className="absolute -top-1 -left-1 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-white transform rotate-12">
                      חדש
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-b-2xl border-t border-slate-200 shadow-lg">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        pathname === item.href
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          pathname === item.href ? "bg-white/20" : `bg-gradient-to-br ${item.gradient}`
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${pathname === item.href ? "text-white" : "text-white"}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                  {item.isNew && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-white">
                        חדש
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
