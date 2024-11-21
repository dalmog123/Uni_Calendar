"use client"

import { Button } from "./button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, BookOpen, Library, Calculator, Menu, Home } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              UniCalendar
            </Link>
          </div>

          {/* Mobile Home Button + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/">
              <Button variant="default" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button 
                variant={pathname === "/" ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                דף הבית
              </Button>
            </Link>
            <Link href="/calendar">
              <Button 
                variant={pathname === "/calendar" ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                לוח שנה
              </Button>
            </Link>
            <Link href="/syllabus">
              <Button 
                variant={pathname === "/syllabus" ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                סילבוס
              </Button>
            </Link>
            <Link href="/materials">
              <Button 
                variant={pathname === "/materials" ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Library className="h-4 w-4" />
                חומרי לימוד
              </Button>
            </Link>
            <Link href="/calculator">
              <Button 
                variant={pathname === "/calculator" ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                חישוב עלות תואר
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link href="/calendar" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={pathname === "/calendar" ? "default" : "ghost"} 
                className="w-full justify-start gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                לוח שנה
              </Button>
            </Link>
            <Link href="/syllabus" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={pathname === "/syllabus" ? "default" : "ghost"} 
                className="w-full justify-start gap-2"
              >
                <BookOpen className="h-4 w-4" />
                סילבוס
              </Button>
            </Link>
            <Link href="/materials" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={pathname === "/materials" ? "default" : "ghost"} 
                className="w-full justify-start gap-2"
              >
                <Library className="h-4 w-4" />
                חומרי לימוד
              </Button>
            </Link>
            <Link href="/calculator" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={pathname === "/calculator" ? "default" : "ghost"} 
                className="w-full justify-start gap-2"
              >
                <Calculator className="h-4 w-4" />
                חישוב עלות תואר
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
} 