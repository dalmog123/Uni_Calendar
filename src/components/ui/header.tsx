import { Button } from "./button"
import Link from "next/link"
import { CalendarDays, BookOpen } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              UniCalendar
            </Link>
          </div>
          <nav className="flex items-center gap-4">
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
          </nav>
        </div>
      </div>
    </header>
  )
} 