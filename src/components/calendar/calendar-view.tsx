"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  PenIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  BookOpen,
  Users,
  Calendar as CalendarLucide,
  ExternalLink,
  Sparkles,
  ArrowLeft
} from "lucide-react"
import { format, parse } from "date-fns"

interface ParsedData {
  [date: string]: string
}

interface TaskData {
  [date: string]: string
}

interface TeacherData {
  [course: string]: {
    [teacher: string]: string
  }
}

export function CalendarView() {
  const [inputText, setInputText] = useState("")
  const [courseName, setCourseName] = useState("")
  const [tableData, setTableData] = useState<Record<string, ParsedData>>({})
  const [taskData, setTaskData] = useState<TaskData>({})
  const [editingTask, setEditingTask] = useState<{ date: string; value: string } | null>(null)
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>(undefined)
  const [newTaskText, setNewTaskText] = useState("")
  const [teacherData, setTeacherData] = useState<TeacherData>({})
  const [editingTeacher, setEditingTeacher] = useState<{ course: string; teacher: string } | null>(null)
  const [isFirstColumnCollapsed, setIsFirstColumnCollapsed] = useState(false)

  const parseInput = (input: string, name: string) => {
    const lines = input.trim().split("\n")
    const newData: ParsedData = {}
    const newTeacherData: { [teacher: string]: string } = {}

    lines.slice(1).forEach((line) => {
      const parts = line.split("\t")
      // Sometimes copy-paste might result in different spacing, basic check
      if (parts.length >= 3) {
        const date = parts[1] // Assuming date is second column based on common format
        const instructor = parts[2]
        const hours = parts[3] || ""
        
        if (date && instructor) {
           // Clean up date string if needed
           const cleanDate = date.trim()
           if(cleanDate) {
             newData[cleanDate] = `${instructor}, ${hours}`
             if (!newTeacherData[instructor]) {
               newTeacherData[instructor] = ""
             }
           }
        }
      }
    })

    setTableData((prev) => ({
      ...prev,
      [name]: newData,
    }))

    setTeacherData((prev) => ({
      ...prev,
      [name]: newTeacherData,
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  const handleAddCourse = () => {
    if (courseName && inputText) {
      parseInput(inputText, courseName)
      setInputText("")
      setCourseName("")
    }
  }

  const handleTaskChange = (date: string, value: string) => {
    setTaskData((prev) => ({
      ...prev,
      [date]: value,
    }))
    setEditingTask(null)
  }

  const handleNewTask = () => {
    if (newTaskDate && newTaskText) {
      const dateString = format(newTaskDate, "dd/MM/yyyy")
      setTaskData((prev) => ({
        ...prev,
        [dateString]: newTaskText,
      }))
      setNewTaskDate(undefined)
      setNewTaskText("")
    }
  }

  const handleTeacherLinkChange = (course: string, teacher: string, link: string) => {
    setTeacherData((prev) => ({
      ...prev,
      [course]: {
        ...prev[course],
        [teacher]: link,
      },
    }))
    setEditingTeacher(null)
  }

  const getAllDates = () => {
    const dates = new Set<string>()
    Object.values(tableData).forEach((table) => {
      Object.keys(table).forEach((date) => dates.add(date))
    })
    Object.keys(taskData).forEach((date) => dates.add(date))
    return Array.from(dates).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number)
      const [dayB, monthB, yearB] = b.split("/").map(Number)
      return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime()
    })
  }

  const dates = getAllDates()
  const courseNames = Object.keys(tableData)

  const exportToICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\n"

    dates.forEach((date) => {
      courseNames.forEach((course) => {
        const eventData = tableData[course][date]
        if (eventData) {
          const [teacher, timeRange] = eventData.split(", ")
          // Basic time parsing logic - assumes format like "16:00 - 19:00"
          if (timeRange && timeRange.includes("-")) {
             const [startTime, endTime] = timeRange.split("-").map(t => t.trim())
             try {
                const fullStartDate = parse(`${date} ${startTime}`, "dd/MM/yyyy HH:mm", new Date())
                const fullEndDate = parse(`${date} ${endTime}`, "dd/MM/yyyy HH:mm", new Date())
                const teacherLink = teacherData[course][teacher] || ""

                icsContent += "BEGIN:VEVENT\n"
                icsContent += `DTSTART:${format(fullStartDate, "yyyyMMdd'T'HHmmss")}\n`
                icsContent += `DTEND:${format(fullEndDate, "yyyyMMdd'T'HHmmss")}\n`
                icsContent += `SUMMARY:${course}\n`
                icsContent += `DESCRIPTION:Teacher: ${teacher}\\nLink: ${teacherLink}\n`
                icsContent += `URL:${teacherLink}\n`
                icsContent += "END:VEVENT\n"
             } catch (e) {
                console.error("Error parsing date/time", e)
             }
          }
        }
      })
    })

    icsContent += "END:VCALENDAR"

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "course_schedule.ics"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden relative" dir="rtl">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-200/20 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] rounded-full bg-emerald-100/30 blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              יצירת <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">לוח שנה</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium">ארגון הסמסטר בקלות ובמהירות</p>
          </div>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">
             כאן תוכלו להזין את נתוני הקורסים שלכם, לנהל מטלות ולייצא הכל ליומן האישי.
          </p>
        </div>

        {/* Course Input Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-md border-slate-200 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              הוספת קורס חדש
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName" className="text-slate-700 font-medium">
                    שם הקורס
                  </Label>
                  <Input
                    id="courseName"
                    placeholder="לדוגמה: מבוא למיקרוכלכלה"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <Label htmlFor="courseInput" className="text-slate-700 font-medium">
                        הדבקת מועדי מפגשים
                      </Label>
                      <span className="text-xs text-slate-400">העתק מאתר השאילתא</span>
                   </div>
                  <Textarea
                    id="courseInput"
                    placeholder="הדבק כאן את הטבלה מאתר האוניברסיטה..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="min-h-[180px] border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all resize-none"
                  />
                </div>
                <Button
                  onClick={handleAddCourse}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-12 text-lg font-medium"
                >
                  <PlusIcon className="h-5 w-5 ml-2" />
                  הוסף ללוח
                </Button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                   <PlayCircleIcon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">צריכים עזרה?</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  צפו בסרטון קצר שמסביר איך להעתיק את המערכת בצורה נכונה כדי שהלוח יבנה בצורה מושלמת.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      צפו בסרטון ההדרכה
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] bg-white/95 backdrop-blur-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-slate-800">איך להשתמש ביומן</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 mt-2">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/lNC7yrbKOho"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Table */}
        {courseNames.length > 0 && (
          <Card className="mb-8 bg-white/80 backdrop-blur-md border-slate-200 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <CalendarLucide className="h-5 w-5 text-white" />
                </div>
                לוח מועדים ומטלות
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableHead className="text-right font-bold text-slate-700 w-[140px] p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-transparent font-bold text-base flex items-center gap-1"
                          onClick={() => setIsFirstColumnCollapsed(!isFirstColumnCollapsed)}
                        >
                          תאריך
                          {isFirstColumnCollapsed ? (
                            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </TableHead>
                      {courseNames.map((name) => (
                        <TableHead key={name} className="text-right font-bold text-slate-700 p-4 min-w-[200px]">
                          {name}
                        </TableHead>
                      ))}
                      <TableHead className="text-right font-bold text-slate-700 p-4 min-w-[250px]">
                        <div className="flex items-center justify-between">
                          <span>מטלות</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                              >
                                <PlusIcon className="h-5 w-5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/95 backdrop-blur-md rounded-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-slate-800">הוסף מטלה חדשה</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-6 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="task-date" className="text-slate-700">תאריך המטלה</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={`w-full justify-start text-left font-normal border-slate-300 rounded-xl h-12 ${!newTaskDate && "text-muted-foreground"}`}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newTaskDate ? format(newTaskDate, "dd/MM/yyyy") : <span>בחר תאריך</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm rounded-xl">
                                      <Calendar
                                        mode="single"
                                        selected={newTaskDate}
                                        onSelect={setNewTaskDate}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="task-text" className="text-slate-700">תיאור המטלה</Label>
                                  <Input
                                    id="task-text"
                                    placeholder="לדוגמה: הגשת ממ״ן 11"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    className="border-slate-300 focus:border-blue-500 rounded-xl h-12"
                                  />
                                </div>
                                <Button
                                  onClick={handleNewTask}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl h-12 mt-2"
                                >
                                  שמור מטלה
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dates.map((date) => (
                      <TableRow key={date} className={`${isFirstColumnCollapsed ? "hidden" : ""} hover:bg-slate-50/80 transition-colors border-slate-100`}>
                        <TableCell className="font-medium text-slate-700 p-4 border-l border-slate-100 bg-slate-50/30">{date}</TableCell>
                        {courseNames.map((name) => (
                          <TableCell key={`${date}-${name}`} className="text-slate-600 p-4 border-l border-slate-100">
                            {tableData[name][date] && (
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-800">{tableData[name][date].split(',')[0]}</span>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-fit">{tableData[name][date].split(',')[1]}</span>
                                </div>
                            ) || ""}
                          </TableCell>
                        ))}
                        <TableCell className="p-4">
                          {editingTask && editingTask.date === date ? (
                            <div className="flex items-center gap-2 animate-in fade-in">
                              <Input
                                value={editingTask.value}
                                onChange={(e) => setEditingTask({ ...editingTask, value: e.target.value })}
                                className="flex-grow border-slate-300 focus:border-blue-500 h-9"
                                autoFocus
                              />
                              <Button
                                size="icon"
                                onClick={() => handleTaskChange(date, editingTask.value)}
                                className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingTask(null)}
                                className="h-9 w-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="group flex items-center justify-between min-h-[2rem]">
                              <span className="text-slate-700">{taskData[date] || ""}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingTask({ date, value: taskData[date] || "" })}
                                className="opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400 transition-opacity"
                              >
                                <PenIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teachers Section */}
        {courseNames.length > 0 && (
          <Card className="mb-8 bg-white/80 backdrop-blur-md border-slate-200 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                רשימת מורים וקישורים
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {courseNames.map((course) => (
                <div key={course} className="bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-100/50 border-b border-slate-200/60 flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                    <h3 className="text-lg font-bold text-slate-800">{course}</h3>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-200/60 bg-transparent">
                        <TableHead className="text-right font-semibold text-slate-600 w-1/3">שם המורה</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600">קישור לזום/הרצאה</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(teacherData[course] || {}).map(([teacher, link]) => (
                        <TableRow key={`${course}-${teacher}`} className="hover:bg-white border-slate-100">
                          <TableCell className="font-medium text-slate-700 py-4">{teacher}</TableCell>
                          <TableCell className="py-4">
                            {editingTeacher &&
                            editingTeacher.course === course &&
                            editingTeacher.teacher === teacher ? (
                              <div className="flex items-center gap-2 animate-in fade-in">
                                <Input
                                  value={link}
                                  placeholder="הדבק קישור כאן..."
                                  onChange={(e) =>
                                    setTeacherData((prev) => ({
                                      ...prev,
                                      [course]: {
                                        ...prev[course],
                                        [teacher]: e.target.value,
                                      },
                                    }))
                                  }
                                  className="flex-grow border-slate-300 focus:border-blue-500 h-9"
                                  autoFocus
                                />
                                <Button
                                  size="icon"
                                  onClick={() => handleTeacherLinkChange(course, teacher, link)}
                                  className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingTeacher(null)}
                                  className="h-9 w-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="group flex items-center justify-between">
                                {link ? (
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium max-w-[300px] truncate"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                    {link}
                                  </a>
                                ) : (
                                  <button
                                    onClick={() => setEditingTeacher({ course, teacher })}
                                    className="text-slate-400 hover:text-slate-600 text-sm italic transition-colors flex items-center gap-1"
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                    הוסף קישור
                                  </button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingTeacher({ course, teacher })}
                                  className="opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400 transition-opacity"
                                >
                                  <PenIcon className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Export Section */}
        {courseNames.length > 0 && (
          <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl rounded-3xl border-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            
            <CardContent className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-100 mb-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">מוכן לשימוש</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">סיימתם לערוך?</h3>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  הורידו את לוח השנה כקובץ וסנכרנו אותו בקלות עם Google Calendar, Outlook או Apple Calendar.
                </p>
              </div>
              
              <Button
                onClick={exportToICS}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold border-0"
              >
                <DownloadIcon className="h-5 w-5 ml-2" />
                הורד קובץ ICS
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}