'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, Plus, Minus, Calendar, Book, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Course {
  id: string
  courseNumber: string
  name: string
  credits: number
  level: string
  semester: string
}

interface Year {
  id: string
  name: string
  semesters: {
    [key: string]: Course[]
  }
}

// Add this interface to define the structure of heavySemesters items
interface HeavySemester {
  year: Year;
  semesterName: string;
  courses: Course[];
}

const syllabusData: Year[] = [
  {
    id: '1',
    name: 'שנה א',
    semesters: {
      'סמסטר א': [
        { id: '1', courseNumber: '91440', name: 'קורס הכנה לבחינת פטור בהנהלת חשבונות', credits: 0, level: 'בחינת פטור', semester: 'סמסטר א' },
        { id: '2', courseNumber: '30111', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א', credits: 3, level: 'פ', semester: 'סמסטר א' },
        { id: '3', courseNumber: '10131', name: 'מבוא למיקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר א' },
        { id: '4', courseNumber: '', name: 'בחינת מיון באנגלית', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '5', courseNumber: '30112', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב', credits: 3, level: 'ר', semester: 'סמסטר ב' },
        { id: '6', courseNumber: '10126', name: 'מבוא למקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ב' },
        { id: '7', courseNumber: '10142', name: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', credits: 3, level: 'פ', semester: 'סמסטר ב' },
        { id: '8', courseNumber: '10863', name: 'יסודות החשבונאות הפינסית', credits: 6, level: 'ר', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '9', courseNumber: '10836', name: 'מבוא למשפט ולדיני עסקים', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '10', courseNumber: '10860', name: 'חשבונאות ניהולית', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '11', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '2',
    name: 'שנה ב',
    semesters: {
      'סמסטר א': [
        { id: '12', courseNumber: '10645', name: 'תכנון, ניתוח ועיצוב מערכות מידע', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '13', courseNumber: '10284', name: 'מושגי יסוד באקונומטריקה', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '14', courseNumber: '10864', name: 'בעיות מדידה בחשבונאות א', credits: 4, level: 'ר', semester: 'סמסטר א' },
        { id: '15', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '16', courseNumber: '10230', name: 'תורת המימון: יהול פיננסי של גופים עסקיים', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '17', courseNumber: '10874', name: 'יסודות ביקורת חשבונות', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '18', courseNumber: '10865', name: 'בעיות מדידה בחשבונאות ב', credits: 4, level: 'ר', semester: 'סמסטר ב' },
        { id: '19', courseNumber: '10870', name: 'מיסים א: הכנסות, הוצאות, ומבוא לרווחי הון', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '20', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '21', courseNumber: '10877', name: 'דיני תאגידים ועסקים', credits: 6, level: 'מ', semester: 'סמסטר ג' },
        { id: '22', courseNumber: '10596', name: 'מערכות מידע תחרותיות-אסטרטגיות', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '3',
    name: 'שנה ג',
    semesters: {
      'סמסטר א': [
        { id: '23', courseNumber: '10871', name: 'מיסים ב: מיסוי תאגידים ורווחי הון', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '24', courseNumber: '10878', name: 'ניתוח נתוני עתק ואבטחת סייבר', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '25', courseNumber: '10861', name: 'חשבונאות ניהולית מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '26', courseNumber: '10866', name: 'דוחות מאוחדים', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '27', courseNumber: '10872', name: 'מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '28', courseNumber: '10867', name: 'חשבונאות פיננסית מתקדמת א', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '29', courseNumber: '10862', name: 'ניתוח דוחות פיננסיים והערכת שווי חברות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '30', courseNumber: '10875', name: 'ביקורת חשבונות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '31', courseNumber: '', name: 'סמינריון בחשבונאות פיננסית', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '4',
    name: 'שנה ד',
    semesters: {
      'סמסטר א': [
        { id: '32', courseNumber: '10873', name: 'מיסים ד: מס ערך מוסף ומיסוי מקרקעין', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '33', courseNumber: '10868', name: 'חשבונאות פיננסית מתקדמת ב', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '34', courseNumber: '10876', name: 'ביקורת חשבונות מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
]

interface HeavySemester {
  year: Year;
  semesterName: string;
  courses: Course[];
}

function redistributeCourses(originalData: Year[], years: number, months: number): Year[] {
  let newData = JSON.parse(JSON.stringify(originalData))
  
  // If it's the default timeline, return original data
  if (years === 3 && months === 4) {
    return originalData
  }

  // Calculate total number of semesters
  const totalSemesters = (years - 3) * 3 + (months === 0 ? 3 : months === 4 ? 1 : months === 9 ? 2 : 0)
  const extraSemesters = totalSemesters - 10 // 10 is the base number of semesters

  if (extraSemesters > 0) {
    // Get all courses from years 3 and 4
    const coursesToRedistribute = newData.slice(2).flatMap((year: Year) =>
      Object.values(year.semesters).flatMap(courses => courses)
    )

    // Clear existing courses from years 3 and 4
    newData.slice(2).forEach((year: Year) => {
      Object.keys(year.semesters).forEach(semester => {
        year.semesters[semester] = []
      })
    })

    // Calculate target courses per semester
    const targetCoursesPerSemester = Math.ceil(coursesToRedistribute.length / (extraSemesters + 6)) // +6 for original semesters in years 3&4

    // Redistribute courses evenly
    let courseIndex = 0
    for (let year = 2; year < newData.length; year++) {
      const semesterOrder = ['סמסטר א', 'סמסטר ב', 'סמסטר ג']
      for (const semester of semesterOrder) {
        if (!newData[year].semesters[semester]) {
          newData[year].semesters[semester] = []
        }
        
        for (let i = 0; i < targetCoursesPerSemester && courseIndex < coursesToRedistribute.length; i++) {
          newData[year].semesters[semester].push(coursesToRedistribute[courseIndex])
          courseIndex++
        }
      }
    }
  }

  return newData
}

function CourseCard({ course }: { course: Course }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <button
          className="w-full text-right flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{course.courseNumber}</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{course.name}</span>
            <span className="text-sm text-muted-foreground">({course.credits} נ"ז)</span>
          </div>
        </button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 border-t bg-muted/50">
          <div className="space-y-3 text-right">
            <p className="text-sm flex items-center justify-end gap-2">
              <span>רמה: {course.level}</span>
              <User className="h-4 w-4" />
            </p>
            <p className="text-sm flex items-center justify-end gap-2">
              <span>סמסטר: {course.semester}</span>
              <Calendar className="h-4 w-4" />
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function DegreeTimeline({ years, months, onYearsChange, onMonthsChange, openYear }: { 
  years: number, 
  months: number, 
  onYearsChange: (newYears: number) => void, 
  onMonthsChange: (newMonths: number) => void,
  openYear?: string
}) {
  // Get the modified syllabus data to calculate actual averages
  const modifiedSyllabusData = redistributeCourses(syllabusData, years, months)

  // Calculate progress based on minimum (3y4m) and maximum (11y4m)
  const totalMonths = (years - 3) * 12 + (months - 4)
  const maxMonths = (11 - 3) * 12
  const progress = (totalMonths / maxMonths) * 100

  // Calculate total courses and total active semesters from modified data
  const totalCourses = modifiedSyllabusData.reduce((total, year) => {
    return total + Object.values(year.semesters).reduce((yearTotal, courses) => {
      return yearTotal + courses.length
    }, 0)
  }, 0)

  // Count actual number of semesters that have courses
  const activeSemesters = modifiedSyllabusData.reduce((total, year) => {
    return total + Object.values(year.semesters).filter(courses => courses.length > 0).length
  }, 0)

  // Calculate actual average courses per semester
  const averageCoursesPerSemester = activeSemesters > 0 
    ? (totalCourses / activeSemesters)
    : 0

  // Rest of the calculations remain the same
  const totalCredits = modifiedSyllabusData.reduce((total, year) => {
    return total + Object.values(year.semesters).reduce((yearTotal, courses) => {
      return yearTotal + courses.reduce((semesterTotal, course) => semesterTotal + course.credits, 0)
    }, 0)
  }, 0)

  const totalSemesters = (years - 3) * 3 + (months === 0 ? 3 : months === 4 ? 1 : months === 9 ? 2 : 0)

  const adjustTime = (increment: boolean) => {
    let newYears = years
    let newMonths = months

    if (increment) {
      // Don't increment if at max (11y4m)
      if (years === 11 && months === 4) return

      // Simplified increment logic: just move to next semester
      if (months === 0) {
        newMonths = 4
      } else if (months === 4) {
        newMonths = 9
      } else { // months === 9
        newMonths = 0
        newYears = years + 1
      }
    } else {
      // Don't decrement if at min (3y4m)
      if (years === 3 && months === 4) return

      // Simplified decrement logic: just move to previous semester
      if (months === 9) {
        newMonths = 4
      } else if (months === 4) {
        newMonths = 0
      } else { // months === 0
        newMonths = 9
        newYears = years - 1
      }
    }

    onYearsChange(newYears)
    onMonthsChange(newMonths)
  }

  useEffect(() => {
    if (openYear) {
      setTimeout(() => {
        const accordionElement = document.getElementById(`accordion-${openYear}`)
        if (accordionElement) {
          const headerOffset = 380;
          const elementPosition = accordionElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [openYear]);

  return (
    <Card className="mb-8">
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustTime(false)}
              disabled={years === 3 && months === 4}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold">{years}</span>
              <span className="text-lg mx-2">שנים</span>
              <span className="text-2xl font-bold">{months}</span>
              <span className="text-lg"> חודשים </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustTime(true)}
              disabled={years === 11 && months === 4}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={progress} className="w-full" />

          <div className="grid grid-cols-2 gap-4 text-sm text-center">
            <div className="flex items-center gap-2 justify-center">
              <Book className="h-4 w-4" />
              <span>{totalCourses} :סה״כ קורסים</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="h-4 w-4" />
              <span>{totalCredits} :סה״כ נקודות זכות</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Clock className="h-4 w-4" />
              <span>{averageCoursesPerSemester.toFixed(1)} :ממוצע קורסים לסמסטר</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <User className="h-4 w-4" />
              <span>{totalSemesters <= 9 ? 'מואץ' : totalSemesters === 10 ? 'רגיל' : 'מוקטן'} :קצב למודים</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Syllabus() {
  const [openYear, setOpenYear] = useState<string | undefined>(undefined)
  const [years, setYears] = useState(3)
  const [months, setMonths] = useState(4)

  // Get modified syllabus data based on timeline
  const modifiedSyllabusData = redistributeCourses(syllabusData, years, months)

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-right">חשבונאות עם חטיבה מורחבת בכלכלה</h1>
      
      <DegreeTimeline 
        years={years} 
        months={months} 
        onYearsChange={setYears} 
        onMonthsChange={setMonths}
        openYear={openYear}
      />
      
      <Accordion 
        type="single" 
        collapsible 
        className="w-full"
        onValueChange={setOpenYear}
      >
        {modifiedSyllabusData.map((year) => (
          <AccordionItem 
            key={year.id} 
            value={year.id}
            id={`accordion-${year.id}`}
          >
            <AccordionTrigger>
              <span className="flex-1 text-right mr-4">{year.name}</span>
            </AccordionTrigger>
            <AccordionContent>
              {Object.entries(year.semesters).map(([semesterName, courses], semesterIndex) => (
                <div 
                  key={semesterName} 
                  className="mb-8 last:mb-4"
                >
                  <div className="bg-muted rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4 border-b pb-3">
                      <h3 className="text-xl font-semibold">{semesterName}</h3>
                      <span className="text-muted-foreground text-sm flex items-center gap-2">
                        <span>נ"ז {courses.reduce((sum, course) => sum + course.credits, 0)}</span>
                        <span>|</span>
                        <span>קורסים {courses.length}</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}