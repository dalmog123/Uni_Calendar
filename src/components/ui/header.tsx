"use client"

import { Button } from "./button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, BookOpen, Library, Calculator, Menu, Home, TimerIcon, X, Cpu } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "ראשי" },
    { href: "/calendar", icon: CalendarDays, label: "לוח שנה" },
    { href: "/syllabus", icon: BookOpen, label: "סילבוס" },
    { href: "/materials", icon: Library, label: "חומרים" },
    { href: "/calculator", icon: Calculator, label: "מחשבון" },
    { href: "/timer", icon: TimerIcon, label: "טיימר", isNew: true },
    { href: "/chat", icon: Cpu, label: "AI Tutor", isSpecial: true },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm py-2" 
          : "bg-transparent py-4"
      }`} 
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg">UC</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-slate-800" : "text-slate-900"}`}>
              UniCalendar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full backdrop-blur-sm border border-slate-200/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              if (item.isSpecial) {
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      size="sm"
                      className="rounded-full px-4 bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition-all ml-1"
                    >
                      <item.icon className="w-4 h-4 ml-2 text-emerald-400" />
                      {item.label}
                    </Button>
                  </Link>
                )
              }

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-4 transition-all ${
                      isActive 
                        ? "bg-white text-slate-900 shadow-sm font-semibold" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ml-2 ${isActive ? "text-blue-600" : "opacity-50"}`} />
                    {item.label}

                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-slate-100 rounded-full"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-5 p-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <div className={`flex items-center p-3 rounded-xl border ${pathname === item.href ? "border-blue-200 bg-blue-50 text-blue-700" : "border-transparent hover:bg-slate-50 text-slate-700"}`}>
                    <item.icon className={`h-5 w-5 ml-3 ${pathname === item.href ? "text-blue-600" : "text-slate-400"}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}