'use client'

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, PenIcon, PlusIcon, CheckIcon, XIcon, PlayCircleIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon } from "lucide-react"
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

export default function Component() {
  const [inputText, setInputText] = useState('')
  const [courseName, setCourseName] = useState('')
  const [tableData, setTableData] = useState<Record<string, ParsedData>>({})
  const [taskData, setTaskData] = useState<TaskData>({})
  const [editingTask, setEditingTask] = useState<{ date: string; value: string } | null>(null)
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>(undefined)
  const [newTaskText, setNewTaskText] = useState('')
  const [teacherData, setTeacherData] = useState<TeacherData>({})
  const [editingTeacher, setEditingTeacher] = useState<{ course: string; teacher: string } | null>(null)
  const [isFirstColumnCollapsed, setIsFirstColumnCollapsed] = useState(false)

  const parseInput = (input: string, name: string) => {
    const lines = input.trim().split('\n')
    const newData: ParsedData = {}
    const newTeacherData: { [teacher: string]: string } = {}

    lines.slice(1).forEach(line => {
      const [, date, instructor, hours] = line.split('\t')
      if (date && instructor && hours) {
        newData[date] = `${instructor}, ${hours}`
        if (!newTeacherData[instructor]) {
          newTeacherData[instructor] = ''
        }
      }
    })

    setTableData(prev => ({
      ...prev,
      [name]: newData
    }))

    setTeacherData(prev => ({
      ...prev,
      [name]: newTeacherData
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  const handleAddCourse = () => {
    if (courseName && inputText) {
      parseInput(inputText, courseName)
      setInputText('')
      setCourseName('')
    }
  }

  const handleTaskChange = (date: string, value: string) => {
    setTaskData(prev => ({
      ...prev,
      [date]: value
    }))
    setEditingTask(null)
  }

  const handleNewTask = () => {
    if (newTaskDate && newTaskText) {
      const dateString = format(newTaskDate, 'dd/MM/yyyy')
      setTaskData(prev => ({
        ...prev,
        [dateString]: newTaskText
      }))
      setNewTaskDate(undefined)
      setNewTaskText('')
    }
  }

  const handleTeacherLinkChange = (course: string, teacher: string, link: string) => {
    setTeacherData(prev => ({
      ...prev,
      [course]: {
        ...prev[course],
        [teacher]: link
      }
    }))
    setEditingTeacher(null)
  }

  const getAllDates = () => {
    const dates = new Set<string>()
    Object.values(tableData).forEach(table => {
      Object.keys(table).forEach(date => dates.add(date))
    })
    Object.keys(taskData).forEach(date => dates.add(date))
    return Array.from(dates).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number)
      const [dayB, monthB, yearB] = b.split('/').map(Number)
      return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime()
    })
  }

  const dates = getAllDates()
  const courseNames = Object.keys(tableData)

  const exportToICS = () => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\n'

    dates.forEach(date => {
      courseNames.forEach(course => {
        const eventData = tableData[course][date]
        if (eventData) {
          const [teacher, timeRange] = eventData.split(', ')
          const [startTime, endTime] = timeRange.split(' - ')
          const fullStartDate = parse(`${date} ${startTime}`, 'dd/MM/yyyy HH:mm', new Date())
          const fullEndDate = parse(`${date} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date())
          const teacherLink = teacherData[course][teacher] || ''

          icsContent += 'BEGIN:VEVENT\n'
          icsContent += `DTSTART:${format(fullStartDate, "yyyyMMdd'T'HHmmss")}\n`
          icsContent += `DTEND:${format(fullEndDate, "yyyyMMdd'T'HHmmss")}\n`
          icsContent += `SUMMARY:${course}\n`
          icsContent += `DESCRIPTION:Teacher: ${teacher}\\nLink: ${teacherLink}\n`
          icsContent += `URL:${teacherLink}\n`
          icsContent += 'END:VEVENT\n'
        }
      })
    })

    icsContent += 'END:VCALENDAR'

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'course_schedule.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-4 space-y-6" dir="rtl">
      <div className="space-y-4">
        <div>
          <Label htmlFor="courseName">שם קורס</Label>
          <Input
            id="courseName"
            placeholder="הכנס שם קורס"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div>
          <Label htmlFor="courseInput">מועדי מפגשים</Label>
          <Textarea
            id="courseInput"
            placeholder="הדבק את מועדי המפגשים כאן..."
            value={inputText}
            onChange={handleInputChange}
            className="w-full h-64"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleAddCourse} className="ml-4">הוסף קורס</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="px-4">
                <PlayCircleIcon className="mr-2 h-4 w-4" />
                <span>צפה בסרטון הדרכה</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>סרטון הדרכה</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <iframe 
                  width="560" 
                  height="315" 
                  src="https://www.youtube.com/embed/LObJjIBKTXc" 
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

      {courseNames.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    onClick={() => setIsFirstColumnCollapsed(!isFirstColumnCollapsed)}
                  >
                    תאריך {isFirstColumnCollapsed ? <ChevronDownIcon className="ml-2 h-4 w-4" /> : <ChevronUpIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                {courseNames.map((name) => (
                  <TableHead key={name} className="text-right">{name}</TableHead>
                ))}
                <TableHead className="text-right">
                  <div className="flex items-center justify-between">
                    <span>מטלות</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>הוסף מטלה חדשה</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="task-date" className="text-right">
                              תאריך
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-[280px] justify-start text-left font-normal ${
                                    !newTaskDate && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newTaskDate ? format(newTaskDate, 'dd/MM/yyyy') : <span>בחר תאריך</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
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
                            <Label htmlFor="task-text" className="text-right">
                              מטלה
                            </Label>
                            <Input
                              id="task-text"
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleNewTask}>הוסף מטלה</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dates.map((date) => (
                <TableRow key={date} className={isFirstColumnCollapsed ? 'hidden' : ''}>
                  <TableCell className="font-medium">{date}</TableCell>
                  {courseNames.map((name) => (
                    <TableCell key={`${date}-${name}`}>
                      {tableData[name][date] || ''}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingTask && editingTask.date === date ? (
                      <div className="flex items-center">
                        <Input
                          value={editingTask.value}
                          onChange={(e) => setEditingTask({ ...editingTask, value: e.target.value })}
                          className="flex-grow ml-2"
                        />
                        <div className="flex items-center space-x-3 mr-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleTaskChange(date, editingTask.value)}
                            className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditingTask(null)}
                            className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{taskData[date] || ''}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingTask({ date, value: taskData[date] || '' })}
                          className="hover:bg-gray-100 rounded-full w-8 h-8 min-w-[2rem] p-0"
                        >
                          <PenIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">רשימת  מורים וקישורים להרצאות</h2>
        {courseNames.map((course) => (
          <div key={course} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{course}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם המורה</TableHead>
                  <TableHead className="text-right">קישור להרצאה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(teacherData[course] || {}).map(([teacher, link]) => (
                  <TableRow key={`${course}-${teacher}`}>
                    <TableCell className="font-medium">{teacher}</TableCell>
                    <TableCell>
                      {editingTeacher && editingTeacher.course === course && editingTeacher.teacher === teacher ? (
                        <div className="flex items-center">
                          <Input
                            value={link}
                            onChange={(e) => setTeacherData(prev => ({
                              ...prev,
                              [course]: {
                                ...prev[course],
                                [teacher]: e.target.value
                              }
                            }))}
                            className="flex-grow ml-2"
                          />
                          <div className="flex items-center space-x-3 mr-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleTeacherLinkChange(course, teacher, link)}
                              className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setEditingTeacher(null)}
                              className="rounded-full w-8 h-8 min-w-[2rem] p-0 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {link || 'לא הוגדר קישור'}
                          </a>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingTeacher({ course, teacher })}
                            className="hover:bg-gray-100 rounded-full w-8 h-8 min-w-[2rem] p-0"
                          >
                            <PenIcon className="h-4 w-4" />
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
      </div>

      <div className="mt-8">
        <Button onClick={exportToICS} className="flex items-center">
          <DownloadIcon className="mr-2 h-4 w-4" />
          ייצא לקובץ ICS
        </Button>
      </div>
    </div>
  )
}