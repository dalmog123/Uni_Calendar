"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CalculatorIcon, DollarSign, BookOpen, GraduationCap, ExternalLink, CheckCircle } from "lucide-react"
import { syllabusData } from '../syllabus/data'

const COSTS = {
  coursePrice: 1792,
  extraGuidance: 349,
  summerSemester: 334,
  security: 52,
  additionalCoursesCount: 5,
  englishCourse: 2422,
  accountingExemption: 2422,
  registration: 877,
  studentOrg: 10,
}

interface SummaryRowProps {
  label: string
  value: number | string
  isTotal?: boolean
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isTotal }) => (
  <TableRow className={isTotal ? "font-bold bg-gradient-to-r from-blue-50 to-indigo-50" : "hover:bg-slate-50"}>
    <TableCell className={isTotal ? "text-slate-800" : "text-slate-700"}>{label}</TableCell>
    <TableCell className={`text-right ${isTotal ? "text-slate-800 text-lg" : "text-slate-700"}`}>
      {typeof value === "number" ? value.toLocaleString() : value}
    </TableCell>
  </TableRow>
)

const areAllCoursesInYearSelected = (year: (typeof syllabusData)[0], selectedCourses: string[]) => {
  const coursesInYear = Object.values(year.semesters)
    .flat()
    .filter(
      (course) => course.courseNumber && !course.courseNumber.includes("אנגלית") && course.courseNumber !== "91440",
    )

  return coursesInYear.length > 0 && coursesInYear.every((course) => selectedCourses.includes(course.id))
}

export default function Calculator() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [englishCourses, setEnglishCourses] = useState(0)
  const [includeAccounting, setIncludeAccounting] = useState(true)
  const [isOriginalSummaryVisible, setIsOriginalSummaryVisible] = useState(true)
  const summaryRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOriginalSummaryVisible(entry.isIntersecting)
      },
      {
        threshold: 0,
      },
    )

    if (summaryRef.current) {
      observer.observe(summaryRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const regularCourses =
    syllabusData.reduce((total, year) => {
      return (
        total +
        Object.values(year.semesters).reduce((semTotal, courses) => {
          return (
            semTotal +
            courses.filter(
              (course) =>
                course.courseNumber &&
                !course.courseNumber.toLowerCase().includes("אנגלית") &&
                !course.name.toLowerCase().includes("אנגלית"),
            ).length
          )
        }, 0)
      )
    }, 0) -
    COSTS.additionalCoursesCount -
    1

  const summerSemesters = syllabusData.reduce((total, year) => {
    return total + (year.semesters["סמסטר ג"] ? 1 : 0)
  }, 0)

  const baseCost = regularCourses * COSTS.coursePrice
  const securityCost = regularCourses * COSTS.security
  const summerCost = summerSemesters * COSTS.summerSemester
  const extraGuidanceCost = selectedCourses.length * COSTS.extraGuidance
  const additionalGuidanceCost = COSTS.additionalCoursesCount * COSTS.extraGuidance

  const totalMainCost = baseCost + securityCost + summerCost + extraGuidanceCost
  const totalAdditionalCost = additionalGuidanceCost

  const studyYears = syllabusData.length

  const handleSelectAllCourses = (select: boolean) => {
    if (select) {
      const allCourseIds = syllabusData.flatMap((year) =>
        Object.values(year.semesters).flatMap((courses) =>
          courses
            .filter((course) => course.courseNumber && !course.courseNumber.includes("אנגלית"))
            .map((course) => course.id),
        ),
      )
      setSelectedCourses(allCourseIds)
    } else {
      setSelectedCourses([])
    }
  }

  const totalCost =
    totalMainCost +
    totalAdditionalCost +
    englishCourses * COSTS.englishCourse +
    (includeAccounting ? COSTS.accountingExemption : 0) +
    COSTS.registration +
    COSTS.studentOrg * studyYears

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {!isOriginalSummaryVisible && (
          <div className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 shadow-lg">
            <div className="container mx-auto px-4 py-3 max-w-6xl">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">סה״כ עלות התואר:</span>
                <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {totalCost.toLocaleString()} ₪
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              מחשבון עלות תואר
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            חישוב מקורב של עלות התואר בחשבונאות באוניברסיטה הפתוחה
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Summary Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                סיכום עלויות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-right font-semibold text-slate-700">פריט</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">עלות (₪)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SummaryRow label="עלויות עיקריות" value={totalMainCost} />
                  <SummaryRow
                    label="עלויות נוספות"
                    value={
                      totalAdditionalCost +
                      englishCourses * COSTS.englishCourse +
                      (includeAccounting ? COSTS.accountingExemption : 0) +
                      COSTS.registration +
                      COSTS.studentOrg * studyYears
                    }
                  />
                  <TableRow ref={summaryRef} className="border-t-2 border-slate-300">
                    <TableCell className="font-bold text-lg text-slate-800 py-4">סה״כ עלות התואר</TableCell>
                    <TableCell className="text-right font-bold text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent py-4">
                      {totalCost.toLocaleString()} ₪
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <a
                    href="https://www.openu.ac.il/registration/payments/tables/pages/default.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 font-medium hover:underline transition-colors"
                  >
                    *זהו אומדן בלבד. לטבלת התשלומים המלאה באתר האוניברסיטה הפתוחה לחץ כאן
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  עלויות עיקריות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-right font-semibold text-slate-700">פריט</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">עלות (₪)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SummaryRow label={`קורסים (${regularCourses})`} value={baseCost} />
                    <SummaryRow label="דמי אבטחה" value={securityCost} />
                    <SummaryRow label={`תוספת קיץ (${summerSemesters} סמסטרים)`} value={summerCost} />
                    <SummaryRow label={`הנחייה מוגברת (${selectedCourses.length} קורסים)`} value={extraGuidanceCost} />
                    <SummaryRow label="סה״כ" value={totalMainCost} isTotal />
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  עלויות נוספות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-right font-semibold text-slate-700">פריט</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">עלות (₪)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SummaryRow label={`קורסי נוספים (${COSTS.additionalCoursesCount})`} value="0" />
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="accountingExemption"
                            checked={includeAccounting}
                            onCheckedChange={(checked) => setIncludeAccounting(checked as boolean)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                          />
                          <label htmlFor="accountingExemption" className="text-slate-700 cursor-pointer">
                            קורס פטור בהנהלת חשבונות
                          </label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {(includeAccounting ? COSTS.accountingExemption : 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700">קורסי אנגלית:</span>
                          <Select
                            value={englishCourses.toString()}
                            onValueChange={(value) => setEnglishCourses(Number(value))}
                          >
                            <SelectTrigger className="w-[100px] border-slate-300 focus:border-blue-500">
                              <SelectValue placeholder="בחר" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {(englishCourses * COSTS.englishCourse).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <SummaryRow label="הרשמה ללימודים" value={COSTS.registration} />
                    <SummaryRow label={`ארגון סטודנטים (${studyYears} שנים)`} value={COSTS.studentOrg * studyYears} />
                    <SummaryRow
                      label="סה״כ"
                      value={
                        totalAdditionalCost +
                        englishCourses * COSTS.englishCourse +
                        (includeAccounting ? COSTS.accountingExemption : 0) +
                        COSTS.registration +
                        COSTS.studentOrg * studyYears
                      }
                      isTotal
                    />
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Course Selection Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CalculatorIcon className="h-4 w-4 text-white" />
                </div>
                בחירת קורסים להנחייה מוגברת
              </CardTitle>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleSelectAllCourses(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  בחר הכל
                </Button>
                <Button
                  onClick={() => handleSelectAllCourses(false)}
                  className="bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  נקה הכל
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-2">
                {syllabusData.map((year) => (
                  <AccordionItem
                    value={year.id}
                    key={year.id}
                    className="border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <AccordionTrigger className="group px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3">
                        {areAllCoursesInYearSelected(year, selectedCourses) && (
                          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg" />
                        )}
                        <span className="font-semibold text-slate-800">{year.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {Object.entries(year.semesters).map(([semester, courses]) => (
                        <div key={`${year.id}-${semester}`} className="mb-6">
                          <h4 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            {semester}
                          </h4>
                          <div className="space-y-2">
                            {courses
                              .filter(
                                (course) =>
                                  course.courseNumber &&
                                  !course.courseNumber.includes("אנגלית") &&
                                  course.courseNumber !== "91440",
                              )
                              .map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors"
                                >
                                  <Checkbox
                                    id={course.id}
                                    checked={selectedCourses.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedCourses([...selectedCourses, course.id])
                                      } else {
                                        setSelectedCourses(selectedCourses.filter((id) => id !== course.id))
                                      }
                                    }}
                                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                                  />
                                  <label
                                    htmlFor={course.id}
                                    className="text-sm text-slate-700 cursor-pointer leading-relaxed"
                                  >
                                    {course.name} ({course.courseNumber})
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
