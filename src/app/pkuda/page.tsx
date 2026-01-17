"use client"

export default function PkudaPage() {
  return (
    <div className="w-full h-screen" dir="rtl">
      <iframe 
        src="/pkuda.html" 
        className="w-full h-full border-0"
        title="פקודת מס הכנסה"
        suppressHydrationWarning
      />
    </div>
  )
}
