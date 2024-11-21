'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { ChevronDown, ChevronUp, Calendar, Book, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Course, Year, syllabusData } from './data'

const CourseCard: React.FC<{ course: Course; isDragging: boolean }> = ({ course, isDragging }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={`w-full mb-2 ${isDragging ? 'shadow-lg' : ''}`}>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{course.courseNumber}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardTitle className="text-sm">{course.name}</CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-3 text-sm">
          <div className="flex justify-between items-center">
            <span>{course.credits} נ"ז</span>
            <span>רמה: {course.level}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>{course.semester}</span>
            <User className="h-4 w-4" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

const SemesterColumn: React.FC<{ semesterName: string; courses: Course[]; yearId: string }> = ({ semesterName, courses, yearId }) => {
  return (
    <Droppable 
      droppableId={`${yearId}-${semesterName}`} 
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="bg-muted p-4 rounded-lg"
        >
          <h4 className="font-semibold mb-2">{semesterName}</h4>
          {courses.map((course, index) => (
            <Draggable key={course.id} draggableId={course.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <CourseCard course={course} isDragging={snapshot.isDragging} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

const YearCard: React.FC<{ year: Year }> = ({ year }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{year.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(year.semesters).map(([semesterName, courses]) => (
          <SemesterColumn 
            key={semesterName} 
            semesterName={semesterName} 
            courses={courses} 
            yearId={year.id} 
          />
        ))}
      </div>
    </CardContent>
  </Card>
)

const Timeline: React.FC<{ 
  years: number; 
  setYears: (years: number) => void; 
  totalCourses: number; 
  totalCredits: number 
}> = ({ years, setYears, totalCourses, totalCredits }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>משך הלימודים</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <Slider
          value={[years]}
          onValueChange={(value) => setYears(value[0])}
          min={3}
          max={11}
          step={0.5}
          className="flex-grow"
        />
        <span className="text-2xl font-bold">{years} שנים</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          <span>{totalCourses} קורסים</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{totalCredits} נ"ז</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{(totalCourses / (years * 2)).toFixed(1)} קורסים לסמסטר</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{years <= 3.5 ? 'מואץ' : years <= 4 ? 'רגיל' : 'מוקטן'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Syllabus() {
  const [years, setYears] = useState(4)
  const [syllabusState, setSyllabusState] = useState(syllabusData)

  const totalCourses = syllabusState.reduce((total, year) => 
    total + Object.values(year.semesters).reduce((yearTotal, semester) => 
      yearTotal + semester.length, 0), 0)

  const totalCredits = syllabusState.reduce((total, year) => 
    total + Object.values(year.semesters).reduce((yearTotal, semester) => 
      yearTotal + semester.reduce((semesterTotal, course) => 
        semesterTotal + course.credits, 0), 0), 0)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const [sourceYearId, sourceSemester] = source.droppableId.split('-')
    const [destYearId, destSemester] = destination.droppableId.split('-')

    const newSyllabusState = [...syllabusState]
    const sourceYear = newSyllabusState.find(y => y.id === sourceYearId)
    const destYear = newSyllabusState.find(y => y.id === destYearId)

    if (sourceYear && destYear) {
      const [removed] = sourceYear.semesters[sourceSemester].splice(source.index, 1)
      destYear.semesters[destSemester].splice(destination.index, 0, removed)
      setSyllabusState(newSyllabusState)
    }
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-right">חשבונאות עם חטיבה מורחבת בכלכלה</h1>
      
      <Timeline 
        years={years} 
        setYears={setYears} 
        totalCourses={totalCourses} 
        totalCredits={totalCredits} 
      />
      
      <DragDropContext onDragEnd={onDragEnd}>
        {syllabusState.map((year) => (
          <YearCard key={year.id} year={year} />
        ))}
      </DragDropContext>
    </div>
  )
}