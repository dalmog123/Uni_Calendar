'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Course, Year, syllabusData } from './data'

const SyllabusSelector: React.FC<{ selectedPlan: string; onPlanChange: (value: string) => void }> = ({ selectedPlan, onPlanChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>בחר/י מסלול לימודים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={() => onPlanChange('3.5-first')}
            className={`p-3 rounded-lg text-right transition-colors min-w-40 ${
              selectedPlan === '3.5-first' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            3.5 שנים - סמסטר א׳
          </button>
          <button
            onClick={() => onPlanChange('3.5-second')}
            className={`p-3 rounded-lg text-right transition-colors ${
              selectedPlan === '3.5-second' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            3.5 שנים - סמסטר ב׳
          </button>
          <button
            onClick={() => onPlanChange('4.5-first')}
            className={`p-3 rounded-lg text-right transition-colors ${
              selectedPlan === '4.5-first' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            4.5 שנים - סמסטר א׳
          </button>
          <button
            onClick={() => onPlanChange('4.5-second')}
            className={`p-3 rounded-lg text-right transition-colors ${
              selectedPlan === '4.5-second' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            4.5 שנים - סמסטר ב׳
          </button>
          <button
            disabled
            className="p-3 rounded-lg text-right opacity-50 cursor-not-allowed"
          >
            מותאם אישית (בקרוב)
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

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

export default function Syllabus() {
  const [selectedPlan, setSelectedPlan] = useState('3.5-first')
  const [syllabusState, setSyllabusState] = useState(syllabusData)

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)
    // Here you would load the appropriate syllabus data based on the selected plan
    // For now, we'll keep using the same syllabusData
  }

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
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-right">סילבוס</h1>
        <p className="text-xl text-gray-600 text-right">
          חשבונאות עם חטיבה מורחבת בכלכלה
        </p>
      </div>
      
      <SyllabusSelector selectedPlan={selectedPlan} onPlanChange={handlePlanChange} />
      
      <DragDropContext onDragEnd={onDragEnd}>
        {syllabusState.map((year) => (
          <YearCard key={year.id} year={year} />
        ))}
      </DragDropContext>
    </div>
  )
}