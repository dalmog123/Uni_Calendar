'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { syllabusData } from '../syllabus/data'

const COSTS = {
  coursePrice: 1773,
  extraGuidance: 343,
  summerSemester: 327,
  security: 52,
  additionalCoursesCount: 5,
  englishCourse: 2000,
  accountingExemption: 2000,
  registration: 777,
  studentOrg: 10,
}

interface SummaryRowProps {
  label: string
  value: number | string
  isTotal?: boolean
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isTotal }) => (
  <TableRow className={isTotal ? 'font-bold' : ''}>
    <TableCell>{label}</TableCell>
    <TableCell className="text-right">{typeof value === 'number' ? value.toLocaleString() : value}</TableCell>
  </TableRow>
)

export default function Calculator() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [englishCourses, setEnglishCourses] = useState(0)
  const [includeAccounting, setIncludeAccounting] = useState(true)
  
  const regularCourses = syllabusData.reduce((total, year) => {
    return total + Object.values(year.semesters).reduce((semTotal, courses) => {
      return semTotal + courses.filter(course => 
        course.courseNumber && 
        !course.courseNumber.toLowerCase().includes('אנגלית') &&
        !course.name.toLowerCase().includes('אנגלית')
      ).length
    }, 0)
  }, 0) - COSTS.additionalCoursesCount - 1;

  const summerSemesters = syllabusData.reduce((total, year) => {
    return total + (year.semesters['סמסטר ג'] ? 1 : 0)
  }, 0)

  const baseCost = regularCourses * COSTS.coursePrice
  const securityCost = regularCourses * COSTS.security
  const summerCost = summerSemesters * COSTS.summerSemester
  const extraGuidanceCost = selectedCourses.length * COSTS.extraGuidance
  const additionalGuidanceCost = COSTS.additionalCoursesCount * COSTS.extraGuidance

  const totalMainCost = baseCost + securityCost + summerCost + extraGuidanceCost
  const totalAdditionalCost = additionalGuidanceCost

  const studyYears = syllabusData.length;

  const handleSelectAllCourses = (select: boolean) => {
    if (select) {
      const allCourseIds = syllabusData.flatMap(year => 
        Object.values(year.semesters).flatMap(courses => 
          courses
            .filter(course => course.courseNumber && !course.courseNumber.includes('אנגלית'))
            .map(course => course.id)
        )
      );
      setSelectedCourses(allCourseIds);
    } else {
      setSelectedCourses([]);
    }
  };

  const totalCost = totalMainCost + 
    totalAdditionalCost + 
    (englishCourses * COSTS.englishCourse) + 
    (includeAccounting ? COSTS.accountingExemption : 0) + 
    COSTS.registration + 
    (COSTS.studentOrg * studyYears);

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">חישוב עלות תואר</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>סיכום עלויות</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">פריט</TableHead>
                  <TableHead className="text-right">עלות (₪)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SummaryRow label="עלויות עיקריות" value={totalMainCost} />
                <SummaryRow label="עלויות נוספות" value={totalAdditionalCost + 
                  (englishCourses * COSTS.englishCourse) + 
                  (includeAccounting ? COSTS.accountingExemption : 0) + 
                  COSTS.registration + 
                  (COSTS.studentOrg * studyYears)} />
                <SummaryRow label="סה״כ עלות התואר" value={totalCost} isTotal />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>עלויות עיקריות</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">פריט</TableHead>
                    <TableHead className="text-right">עלות (₪)</TableHead>
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

          <Card>
            <CardHeader>
              <CardTitle>עלויות נוספות</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">פריט</TableHead>
                    <TableHead className="text-right">עלות (₪)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SummaryRow label={`קורסים נוספים (${COSTS.additionalCoursesCount})`} value="0" />
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="accountingExemption"
                          checked={includeAccounting}
                          onCheckedChange={(checked) => setIncludeAccounting(checked as boolean)}
                        />
                        <label htmlFor="accountingExemption">קורס פטור בהנהלת חשבונות</label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{(includeAccounting ? COSTS.accountingExemption : 0).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>קורסי אנגלית:</span>
                        <Select
                          value={englishCourses.toString()}
                          onValueChange={(value) => setEnglishCourses(Number(value))}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="בחר" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{(englishCourses * COSTS.englishCourse).toLocaleString()}</TableCell>
                  </TableRow>
                  <SummaryRow label="הרשמה ללימודים" value={COSTS.registration} />
                  <SummaryRow label={`ארגון סטודנטים (${studyYears} שנים)`} value={COSTS.studentOrg * studyYears} />
                  <SummaryRow 
                    label="סה״כ" 
                    value={
                      totalAdditionalCost + 
                      (englishCourses * COSTS.englishCourse) + 
                      (includeAccounting ? COSTS.accountingExemption : 0) + 
                      COSTS.registration + 
                      (COSTS.studentOrg * studyYears)
                    } 
                    isTotal 
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>בחירת קורסים להנחייה מוגברת</CardTitle>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleSelectAllCourses(true)} variant="outline">
                בחר הכל
              </Button>
              <Button onClick={() => handleSelectAllCourses(false)} variant="outline">
                נקה הכל
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {syllabusData.map((year) => (
                <AccordionItem value={year.id} key={year.id}>
                  <AccordionTrigger>{year.name}</AccordionTrigger>
                  <AccordionContent>
                    {Object.entries(year.semesters).map(([semester, courses]) => (
                      <div key={`${year.id}-${semester}`} className="mb-4">
                        <h4 className="font-semibold mb-2">{semester}</h4>
                        {courses
                          .filter(course => 
                            course.courseNumber && 
                            !course.courseNumber.includes('אנגלית') &&
                            course.courseNumber !== '91440'
                          )
                          .map(course => (
                            <div key={course.id} className="flex items-center space-x-2 mb-1">
                              <Checkbox
                                id={course.id}
                                checked={selectedCourses.includes(course.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCourses([...selectedCourses, course.id])
                                  } else {
                                    setSelectedCourses(selectedCourses.filter(id => id !== course.id))
                                  }
                                }}
                              />
                              <label htmlFor={course.id} className="text-sm">
                                {course.name} ({course.courseNumber})
                              </label>
                            </div>
                          ))
                        }
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
  )
}

