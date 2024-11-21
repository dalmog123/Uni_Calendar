"use client"

import { Button } from "./button"
import Link from "next/link"
import { CalendarDays, BookOpen, Library, Calculator, Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              UniCalendar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                לוח שנה
              </Button>
            </Link>
            <Link href="/syllabus">
              <Button variant="ghost" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                סילבוס
              </Button>
            </Link>
            <Link href="/materials">
              <Button variant="ghost" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                חומרי לימוד
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="ghost" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                חישוב עלות תואר
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CalendarDays className="h-4 w-4" />
                לוח שנה
              </Button>
            </Link>
            <Link href="/syllabus" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                סילבוס
              </Button>
            </Link>
            <Link href="/materials" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Library className="h-4 w-4" />
                חומרי לימוד
              </Button>
            </Link>
            <Link href="/calculator" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2">
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