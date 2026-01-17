"use client"

export default function PkudaPage() {
  return (
    <div className="w-full h-screen flex flex-col" dir="rtl">
      <iframe 
        src="/pkuda.html" 
        className="w-full flex-grow border-0"
        title="פקודת מס הכנסה"
        suppressHydrationWarning
      />
      <p className="text-center text-slate-400 text-xs py-2 px-4 bg-slate-50">
        * התוכן מוצג למטרות לימודיות בלבד. אין האתר אחראי על דיוק התוכן או עדכוניו.
      </p>
    </div>
  )
}
