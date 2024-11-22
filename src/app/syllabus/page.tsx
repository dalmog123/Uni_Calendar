'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Course, Year, syllabusPlans } from './data'

const SyllabusSelector: React.FC<{ selectedPlan: string; onPlanChange: (value: string) => void }> = ({ selectedPlan, onPlanChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>בחר/י מסלול לימודים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:justify-start">
          <button
            onClick={() => onPlanChange('3.5-first')}
            className={`p-2 md:p-3 rounded-lg text-right transition-colors text-[15px] md:text-base whitespace-nowrap ${
              selectedPlan === '3.5-first' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            3.5 שנים - סמסטר א׳
          </button>
          <button
            onClick={() => onPlanChange('3.5-second')}
            className={`p-2 md:p-3 rounded-lg text-right transition-colors text-[15px] md:text-base whitespace-nowrap ${
              selectedPlan === '3.5-second' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            3.5 שנים - סמסטר ב׳
          </button>
          <button
            onClick={() => onPlanChange('4.5-first')}
            className={`p-2 md:p-3 rounded-lg text-right transition-colors text-[15px] md:text-base whitespace-nowrap ${
              selectedPlan === '4.5-first' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            4.5 שנים - סמסטר א׳
          </button>
          <button
            onClick={() => onPlanChange('4.5-second')}
            className={`p-2 md:p-3 rounded-lg text-right transition-colors text-[15px] md:text-base whitespace-nowrap ${
              selectedPlan === '4.5-second' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            4.5 שנים - סמסטר ב׳
          </button>
          <button
            disabled
            className="p-2 md:p-3 rounded-lg text-right opacity-50 cursor-not-allowed text-[15px] md:text-base whitespace-nowrap"
          >
            מותאם אישית (בקרוב)
          </button>
        </div>
        
        <div className="mt-4 text-center md:text-right">
          <a 
            href="https://www.openu.ac.il/registration/sesoneanddates/pages/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[15px] md:text-sm text-primary hover:text-primary/80 bg-primary/10 px-2 py-1.5 md:px-3 md:py-2 rounded-md transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            מידע על תקופות הרשמה ומועדי הרשמה
          </a>
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
  const [selectedPlan, setSelectedPlan] = useState<string>('3.5-first')
  const [syllabusState, setSyllabusState] = useState(() => syllabusPlans['3.5-first'])

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)
    setSyllabusState(syllabusPlans[value as keyof typeof syllabusPlans])
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

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-primary">מידע על עבודה סמינריונית</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-6">
          <p className="text-base leading-relaxed">
            במסגרת התכנית יש לכתוב עבודה סמינריונית אחת בחשבונאות. כתיבת העבודה הסמינריונית והגשתה הי במסגרת סמינריון באחד משלושת הקורסים:
          </p>
          <ul className="list-none space-y-4 pr-4">
            <li className="flex gap-3">
              <span className="text-primary font-bold text-[0.8em]">●</span>
              <div>
                <span className="font-medium">דוחות מאוחדים</span> - (10866)
                <div className="text-muted-foreground">סמינריון: נושאים בחשבונאות פיננסית (96037)</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold text-[0.8em]">●</span>
              <div>
                <span className="font-medium">ביקורת חשבונות</span> - (10875)
                <div className="text-muted-foreground">סמינריון: נושאים בביקורת, בחשבונאות פיננסית ודיווח כספי (96038)</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold text-[0.8em]">●</span>
              <div>
                <span className="font-medium">מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות במיסים</span> - (10872)
                <div className="text-muted-foreground">
                  סמינריון: נושאים במיסים, בחשבונאות פיננסית ודיווח כספי (96039)
                  <div className="mt-1">
                    <span className="text-primary">או</span> סמינריון נושאים במסים, בחשבונאות פיננסית ודיווח כספי 
                    <span className="bg-primary/10 px-2 py-0.5 rounded mx-1">(אנגלית)</span>
                    (91635) 
                    <span className="bg-primary/10 px-2 py-0.5 rounded mx-1">קורס תוכן EMI</span>
                    <div className="text-xs text-primary-foreground/70 mt-1">* מיועד לסטודנטים שהגיעו לרמת פטור באנגלית</div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="bg-muted p-4 rounded-lg mt-6 text-base">
            <p className="font-medium">
              ⚠️ ההרשמה לסמינריון מותנת בסיום הקורס בהצלחה.
            </p>
            <p className="font-medium mt-2">
              ⚠️ ההשתתפות בכל מפגשי הסמינריון במלואם הינה חובה.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}