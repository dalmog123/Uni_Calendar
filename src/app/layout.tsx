import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/ui/header"
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: "UniCalendar",
  description: "Tools for university students",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
