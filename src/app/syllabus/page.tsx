"use client"

import type React from "react"
import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { ChevronDown, ChevronUp, ExternalLink, GripVertical, BookOpen, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Course, type Year, syllabusPlans } from "./data"

const SyllabusSelector: React.FC<{ selectedPlan: string; onPlanChange: (value: string) => void }> = ({
  selectedPlan,
  onPlanChange,
}) => {
  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          בחר/י מסלול לימודים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "3.5-first", label: "3.5 שנים - סמסטר א׳", gradient: "from-blue-500 to-cyan-500" },
            { id: "3.5-second", label: "3.5 שנים - סמסטר ב׳", gradient: "from-purple-500 to-pink-500" },
            { id: "4.5-first", label: "4.5 שנים - סמסטר א׳", gradient: "from-emerald-500 to-teal-500" },
            { id: "4.5-second", label: "4.5 שנים - סמסטר ב׳", gradient: "from-orange-500 to-red-500" },
          ].map((plan) => (
            <button
              key={plan.id}
              onClick={() => onPlanChange(plan.id)}
              className={`group p-4 rounded-xl text-right transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.id
                  ? `bg-gradient-to-br ${plan.gradient} text-white shadow-lg`
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <div className="font-medium text-sm">{plan.label}</div>
            </button>
          ))}

          <button
            disabled
            className="p-4 rounded-xl text-right opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border border-slate-200"
          >
            <div className="font-medium text-sm">מותאם אישית</div>
            <div className="text-xs mt-1">(בקרוב)</div>
          </button>
        </div>

        <div className="flex justify-center">
          <a
            href="https://www.openu.ac.il/registration/sesoneanddates/pages/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <ExternalLink className="h-4 w-4 text-white" />
            </div>
            <span className="text-slate-700 group-hover:text-slate-900 font-medium">
              מידע על תקופות הרשמה ומועדי הרשמה
            </span>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

const CourseCard: React.FC<{ course: Course; isDragging: boolean }> = ({ course, isDragging }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      className={`w-full mb-3 transition-all duration-300 ${
        isDragging
          ? "shadow-2xl shadow-blue-500/20 bg-white scale-105"
          : "bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg border-slate-200"
      }`}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {course.courseNumber}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-slate-100">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardTitle className="text-base text-slate-800 leading-relaxed">{course.name}</CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span className="text-slate-600">{course.credits} נ"ז</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-slate-600">רמה: {course.level}</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            <span className="font-medium">סמסטר:</span> {course.semester}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

const SemesterColumn: React.FC<{ semesterName: string; courses: Course[]; yearId: string }> = ({
  semesterName,
  courses,
  yearId,
}) => {
  const getSemesterGradient = (semester: string) => {
    switch (semester) {
      case "סמסטר א":
        return "from-blue-500 to-cyan-500"
      case "סמסטר ב":
        return "from-purple-500 to-pink-500"
      case "סמסטר קיץ":
        return "from-emerald-500 to-teal-500"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  return (
    <Droppable
      droppableId={`${yearId}-${semesterName}`}
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
    >
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`rounded-xl p-4 transition-all duration-300 ${
            snapshot.isDraggingOver
              ? "bg-blue-50 border-2 border-blue-300 border-dashed"
              : "bg-slate-50 border border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getSemesterGradient(semesterName)} flex items-center justify-center`}
            >
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800">{semesterName}</h4>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{courses.length} קורסים</span>
          </div>

          <div className="space-y-2">
            {courses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <CourseCard course={course} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

const YearCard: React.FC<{ year: Year }> = ({ year }) => (
  <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{year.id}</span>
        </div>
        {year.name}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(year.semesters).map(([semesterName, courses]) => (
          <SemesterColumn key={semesterName} semesterName={semesterName} courses={courses} yearId={year.id} />
        ))}
      </div>
    </CardContent>
  </Card>
)

export default function Syllabus() {
  const [selectedPlan, setSelectedPlan] = useState<string>("3.5-first")
  const [syllabusState, setSyllabusState] = useState(() => syllabusPlans["3.5-first"])

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)
    setSyllabusState(syllabusPlans[value as keyof typeof syllabusPlans])
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const [sourceYearId, sourceSemester] = source.droppableId.split("-")
    const [destYearId, destSemester] = destination.droppableId.split("-")

    const newSyllabusState = [...syllabusState]
    const sourceYear = newSyllabusState.find((y) => y.id === sourceYearId)
    const destYear = newSyllabusState.find((y) => y.id === destYearId)

    if (sourceYear && destYear) {
      const [removed] = sourceYear.semesters[sourceSemester].splice(source.index, 1)
      destYear.semesters[destSemester].splice(destination.index, 0, removed)
      setSyllabusState(newSyllabusState)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              סילבוס
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">חשבונאות עם חטיבה מורחבת בכלכלה</p>
        </div>

        <SyllabusSelector selectedPlan={selectedPlan} onPlanChange={handlePlanChange} />

        <DragDropContext onDragEnd={onDragEnd}>
          {syllabusState.map((year) => (
            <YearCard key={year.id} year={year} />
          ))}
        </DragDropContext>

        {/* Seminar Information */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              מידע על עבודה סמינריונית
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed text-slate-700">
              במסגרת התכנית יש לכתוב עבודה סמינריונית אחת בחשבונאות. כתיבת העבודה הסמינריונית והגשתה הי במסגרת סמינריון
              באחד משלושת הקורסים:
            </p>

            <div className="space-y-4">
              {[
                {
                  course: "דוחות מאוחדים",
                  number: "10866",
                  seminar: "סמינריון: נושאים בחשבונאות פיננסית (96037)",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  course: "ביקורת חשבונות",
                  number: "10875",
                  seminar: "סמינריון: נושאים בביקורת, בחשבונאות פיננסית ודיווח כספי (96038)",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  course: "מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות במיסים",
                  number: "10872",
                  seminar: "סמינריון: נושאים במיסים, בחשבונאות פיננסית ודיווח כספי (96039)",
                  gradient: "from-emerald-500 to-teal-500",
                  extra: true,
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 mt-1`}
                  >
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-slate-800">{item.course}</span>
                      <span className="text-slate-500 mr-2">({item.number})</span>
                    </div>
                    <div className="text-slate-600">{item.seminar}</div>
                    {item.extra && (
                      <div className="text-slate-600">
                        <span className="text-blue-600 font-medium">או</span> סמינריון נושאים במסים, בחשבונאות פיננסית
                        ודיווח כספי
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mx-2 text-sm">(אנגלית)</span>
                        (91635)
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded mx-2 text-sm">
                          קורס תוכן EMI
                        </span>
                        <div className="text-sm text-slate-500 mt-1">* מיועד לסטודנטים שהגיעו לרמת פטור באנגלית</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-semibold text-amber-800">ההרשמה לסמינריון מותנת בסיום הקורס בהצלחה.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-semibold text-amber-800">ההשתתפות בכל מפגשי הסמינריון במלואם הינה חובה.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
