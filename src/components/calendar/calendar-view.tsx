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
  CalendarIcon as CalendarLucide,
  ExternalLink,
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
      const [, date, instructor, hours] = line.split("\t")
      if (date && instructor && hours) {
        newData[date] = `${instructor}, ${hours}`
        if (!newTeacherData[instructor]) {
          newTeacherData[instructor] = ""
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
          const [startTime, endTime] = timeRange.split(" - ")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              יצירת לוח שנה
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            צור לוח שנה אישי עם מועדי המפגשים, מטלות וקישורים להרצאות
          </p>
        </div>

        {/* Course Input Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              הוספת קורס חדש
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="courseName" className="text-slate-700 font-medium">
                שם קורס
              </Label>
              <Input
                id="courseName"
                placeholder="הכנס שם קורס"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="max-w-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseInput" className="text-slate-700 font-medium">
                מועדי מפגשים
              </Label>
              <Textarea
                id="courseInput"
                placeholder="הדבק את מועדי המפגשים כאן..."
                value={inputText}
                onChange={handleInputChange}
                className="w-full h-64 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAddCourse}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlusIcon className="h-4 w-4 ml-2" />
                הוסף קורס
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-100 transition-all duration-300 hover:scale-105"
                  >
                    <PlayCircleIcon className="h-4 w-4 ml-2" />
                    צפה בסרטון הדרכה
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] bg-white/95 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-slate-800">סרטון הדרכה</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="560"
                      height="315"
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
          </CardContent>
        </Card>

        {/* Schedule Table */}
        {courseNames.length > 0 && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <CalendarLucide className="h-5 w-5 text-white" />
                </div>
                לוח מועדים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-right font-semibold text-slate-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-slate-100"
                          onClick={() => setIsFirstColumnCollapsed(!isFirstColumnCollapsed)}
                        >
                          תאריך{" "}
                          {isFirstColumnCollapsed ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      {courseNames.map((name) => (
                        <TableHead key={name} className="text-right font-semibold text-slate-700">
                          {name}
                        </TableHead>
                      ))}
                      <TableHead className="text-right font-semibold text-slate-700">
                        <div className="flex items-center justify-between">
                          <span>מטלות</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/95 backdrop-blur-sm">
                              <DialogHeader>
                                <DialogTitle className="text-slate-800">הוסף מטלה חדשה</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="task-date" className="text-right text-slate-700">
                                    תאריך
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={`w-[280px] justify-start text-left font-normal border-slate-300 ${
                                          !newTaskDate && "text-muted-foreground"
                                        }`}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newTaskDate ? format(newTaskDate, "dd/MM/yyyy") : <span>בחר תאריך</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm">
                                      <Calendar
                                        mode="single"
                                        selected={newTaskDate}
                                        onSelect={setNewTaskDate}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="task-text" className="text-right text-slate-700">
                                    מטלה
                                  </Label>
                                  <Input
                                    id="task-text"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    className="col-span-3 border-slate-300 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={handleNewTask}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                              >
                                הוסף מטלה
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dates.map((date) => (
                      <TableRow key={date} className={`${isFirstColumnCollapsed ? "hidden" : ""} hover:bg-slate-50`}>
                        <TableCell className="font-medium text-slate-700">{date}</TableCell>
                        {courseNames.map((name) => (
                          <TableCell key={`${date}-${name}`} className="text-slate-600">
                            {tableData[name][date] || ""}
                          </TableCell>
                        ))}
                        <TableCell>
                          {editingTask && editingTask.date === date ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingTask.value}
                                onChange={(e) => setEditingTask({ ...editingTask, value: e.target.value })}
                                className="flex-grow border-slate-300 focus:border-blue-500"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleTaskChange(date, editingTask.value)}
                                className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                                className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700">{taskData[date] || ""}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingTask({ date, value: taskData[date] || "" })}
                                className="hover:bg-slate-100 rounded-full w-8 h-8 min-w-[2rem] p-0"
                              >
                                <PenIcon className="h-4 w-4 text-slate-500" />
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
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                רשימת מורים וקישורים להרצאות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {courseNames.map((course) => (
                <div key={course}>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    {course}
                  </h3>
                  <div className="bg-slate-50/50 rounded-xl p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          <TableHead className="text-right font-semibold text-slate-700">שם המורה</TableHead>
                          <TableHead className="text-right font-semibold text-slate-700">קישור להרצאה</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(teacherData[course] || {}).map(([teacher, link]) => (
                          <TableRow key={`${course}-${teacher}`} className="hover:bg-white/60">
                            <TableCell className="font-medium text-slate-700">{teacher}</TableCell>
                            <TableCell>
                              {editingTeacher &&
                              editingTeacher.course === course &&
                              editingTeacher.teacher === teacher ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={link}
                                    onChange={(e) =>
                                      setTeacherData((prev) => ({
                                        ...prev,
                                        [course]: {
                                          ...prev[course],
                                          [teacher]: e.target.value,
                                        },
                                      }))
                                    }
                                    className="flex-grow border-slate-300 focus:border-blue-500"
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleTeacherLinkChange(course, teacher, link)}
                                    className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setEditingTeacher(null)}
                                    className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (                                <div className="flex items-center justify-between">
                                  {link ? (
                                    <a
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 transition-colors"
                                    >
                                      {link}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <button
                                      onClick={() => setEditingTeacher({ course, teacher })}
                                      className="text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                      לא הוגדר קישור
                                    </button>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setEditingTeacher({ course, teacher })}
                                    className="hover:bg-slate-100 rounded-full w-8 h-8 min-w-[2rem] p-0"
                                  >
                                    <PenIcon className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Export Section */}
        {courseNames.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <DownloadIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">ייצא ללוח השנה שלך</h3>
                </div>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  ייצא את לוח המועדים שלך לקובץ ICS שניתן לייבא לכל אפליקציית לוח שנה
                </p>
                <Button
                  onClick={exportToICS}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <DownloadIcon className="h-5 w-5 ml-2" />
                  ייצא לקובץ ICS
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
