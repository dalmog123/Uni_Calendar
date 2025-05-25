"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  TimerIcon,
  Volume2,
  ExternalLink,
  Settings,
  Coffee,
  BookOpen,
} from "lucide-react"

type TimerMode = "pomodoro" | "custom"
type TimerState = "idle" | "running" | "paused"
type PomodoroPhase = "work" | "break"

export default function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [state, setState] = useState<TimerState>("idle")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [customDuration, setCustomDuration] = useState(60) // 60 minutes default
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>("work")
  const [pomodoroSession, setPomodoroSession] = useState(1)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Pomodoro settings
  const WORK_TIME = 25 * 60 // 25 minutes
  const BREAK_TIME = 5 * 60 // 5 minutes

  useEffect(() => {
    if (state === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, timeLeft])

  const handleTimerComplete = () => {
    setState("idle")

    if (mode === "pomodoro") {
      if (pomodoroPhase === "work") {
        setPomodoroPhase("break")
        setTimeLeft(BREAK_TIME)
        // Play completion sound or notification
      } else {
        setPomodoroPhase("work")
        setTimeLeft(WORK_TIME)
        setPomodoroSession((prev) => prev + 1)
      }
    }
  }

  const startTimer = () => {
    setState("running")
  }

  const pauseTimer = () => {
    setState("paused")
  }

  const resetTimer = () => {
    setState("idle")
    if (mode === "pomodoro") {
      setTimeLeft(pomodoroPhase === "work" ? WORK_TIME : BREAK_TIME)
    } else {
      setTimeLeft(customDuration * 60)
    }
  }

  const switchMode = (newMode: TimerMode) => {
    setState("idle")
    setMode(newMode)
    if (newMode === "pomodoro") {
      setPomodoroPhase("work")
      setTimeLeft(WORK_TIME)
      setPomodoroSession(1)
    } else {
      setTimeLeft(customDuration * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerProgress = () => {
    const totalTime = mode === "pomodoro" ? (pomodoroPhase === "work" ? WORK_TIME : BREAK_TIME) : customDuration * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const getStatusText = () => {
    switch (state) {
      case "running":
        return "רץ"
      case "paused":
        return "מושהה"
      default:
        return "מוכן"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              טיימר לימודים
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            טיימר להכנה למבחן ולשיפור איכות הלמידה, שימו לב כי אין צליל בסיום הטיימר כרגע!
          </p>
        </div>

        {/* Mode Selection */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => switchMode("pomodoro")}
                className={`h-auto p-6 transition-all duration-300 hover:scale-105 ${
                  mode === "pomodoro"
                    ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
                variant="ghost"
              >
                <div className="flex items-center gap-3">
                  <TimerIcon className="h-6 w-6" />
                  <div className="text-right">
                    <div className="font-semibold text-lg">פומודורו</div>
                    <div className="text-sm opacity-80">25 דקות למידה + 5 דקות הפסקה</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => switchMode("custom")}
                className={`h-auto p-6 transition-all duration-300 hover:scale-105 ${
                  mode === "custom"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
                variant="ghost"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  <div className="text-right">
                    <div className="font-semibold text-lg">טיימר מותאם אישית</div>
                    <div className="text-sm opacity-80">בחרו זמן לפי הצורך</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Timer Duration Selection */}
        {mode === "custom" && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                בחר משך זמן (דקות)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300].map(
                  (duration) => (
                    <Button
                      key={duration}
                      onClick={() => {
                        setCustomDuration(duration)
                        if (state === "idle") {
                          setTimeLeft(duration * 60)
                        }
                      }}
                      className={`h-10 text-sm transition-all duration-300 ${
                        customDuration === duration
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                      variant="ghost"
                    >
                      {duration}
                    </Button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Timer Display */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Pomodoro Status */}
            {mode === "pomodoro" && (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {pomodoroPhase === "work" ? (
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Coffee className="h-6 w-6 text-green-600" />
                  )}
                  <span className="text-xl font-semibold text-slate-800">
                    {pomodoroPhase === "work" ? "זמן למידה" : "זמן הפסקה"}
                  </span>
                </div>
                <div className="text-sm text-slate-600">סשן #{pomodoroSession}</div>
              </div>
            )}

            {/* Timer Circle */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-slate-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getTimerProgress() / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={mode === "pomodoro" ? (pomodoroPhase === "work" ? "#ef4444" : "#10b981") : "#3b82f6"}
                      />
                      <stop
                        offset="100%"
                        stopColor={mode === "pomodoro" ? (pomodoroPhase === "work" ? "#ec4899" : "#06d6a0") : "#06b6d4"}
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Timer Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 font-mono leading-none mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-slate-600 font-medium">{getStatusText()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              {state === "idle" || state === "paused" ? (
                <Button
                  onClick={startTimer}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
                  {state === "paused" ? "המשך" : "התחל"}
                </Button>
              ) : (
                <Button
                  onClick={pauseTimer}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
                  השהה
                </Button>
              )}

              <Button
                onClick={resetTimer}
                className="w-full sm:w-auto bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
                איפוס
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sound Options - Coming Soon */}
        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-300 flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-slate-500" />
              </div>
              צלילי רקע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-slate-500 text-lg mb-4">פיצ'ר זה מגיע בקרוב!</div>
              <div className="text-slate-400 text-sm">בקרוב תוכלו להוסיף צלילי רקע לטיימר בזמן הלמידה שלכם</div>
            </div>
          </CardContent>
          <div className="absolute top-4 left-4 bg-slate-500 text-white text-xs px-2 py-1 rounded-full">בקרוב</div>
        </Card>

        {/* Pomodoro Explanation */}
        {mode === "pomodoro" && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <TimerIcon className="h-4 w-4 text-white" />
                </div>
                מה זה טכניקת הפומודורו?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                טכניקת הפומודורו היא שיטת ניהול זמן שפותחה בסוף שנות ה-80 על ידי פרנצ'סקו סירילו. השיטה משתמשת בטיימר
                כדי לחלק את הלמידה לפרקי זמן של 25 דקות, המופרדים על ידי הפסקות קצרות.
              </p>

              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">איך זה עובד:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>למידה במשך 25 דקות ברציפות</li>
                  <li> הפסקה של 5 דקות</li>
                  <li>חזרה על התהליך</li>
                  <li>אחרי 4 מחזורים, לוקחים הפסקה ארוכה של 15-30 דקות</li>
                </ol>
              </div>

              <div className="flex justify-center">
                <a
                  href="https://he.wikipedia.org/wiki/%D7%98%D7%9B%D7%A0%D7%99%D7%A7%D7%AA_%D7%A4%D7%95%D7%9E%D7%95%D7%93%D7%95%D7%A8%D7%95"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-700 group-hover:text-slate-900 font-medium">קראו עוד בוויקיפדיה</span>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
