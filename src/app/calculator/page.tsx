'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
  <div className={`grid grid-cols-2 ${isTotal ? 'font-bold border-t pt-2' : ''}`}>
    <span>{label}</span>
    <span className="text-left">{typeof value === 'number' ? value.toLocaleString() : value}</span>
  </div>
)

export default function Calculator() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [englishCourses, setEnglishCourses] = useState(0)
  const [includeAccounting, setIncludeAccounting] = useState(false)
  
  // Calculate total regular courses (excluding English courses and additional courses)
  const regularCourses = syllabusData.reduce((total, year) => {
    return total + Object.values(year.semesters).reduce((semTotal, courses) => {
      return semTotal + courses.filter(course => 
        course.courseNumber && 
        !course.courseNumber.toLowerCase().includes('אנגלית') &&
        !course.name.toLowerCase().includes('אנגלית')
      ).length
    }, 0)
  }, 0) - COSTS.additionalCoursesCount - 1;

  // Count summer semesters
  const summerSemesters = syllabusData.reduce((total, year) => {
    return total + (year.semesters['סמסטר ג'] ? 1 : 0)
  }, 0)

  // Calculate costs
  const baseCost = regularCourses * COSTS.coursePrice
  const securityCost = regularCourses * COSTS.security
  const summerCost = summerSemesters * COSTS.summerSemester
  const extraGuidanceCost = selectedCourses.length * COSTS.extraGuidance
  const additionalGuidanceCost = COSTS.additionalCoursesCount * COSTS.extraGuidance

  const totalMainCost = baseCost + securityCost + summerCost + extraGuidanceCost
  const totalAdditionalCost = additionalGuidanceCost

  // Add this calculation
  const studyYears = syllabusData.length;

  // Add new function inside Calculator component
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

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">חישוב עלות תואר</h1>

      <div className="grid gap-6">
        {/* Main Costs Table */}
        <Card>
          <CardHeader>
            <CardTitle>עלויות עיקריות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SummaryRow label={`קורסים: ${regularCourses}`} value={baseCost} />
            <SummaryRow label={`דמי אבטחה לקורס: ${COSTS.security}`} value={securityCost} />
            <SummaryRow label={`תוספת קיץ: ${COSTS.summerSemester}`} value={summerCost} />
            <SummaryRow 
              label={`הנחייה מוגברת (${selectedCourses.length} קורסים): ${COSTS.extraGuidance}`} 
              value={extraGuidanceCost} 
            />
            <SummaryRow label="סה״כ" value={totalMainCost} isTotal />
          </CardContent>
        </Card>

        {/* Additional Costs Table */}
        <Card>
          <CardHeader>
            <CardTitle>עלויות נוספות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SummaryRow 
              label={`קורסים נוספים: ${COSTS.additionalCoursesCount}`} 
              value="0" 
            />
            <SummaryRow 
              label={`הנחייה מוגברת: ${COSTS.extraGuidance}`} 
              value={additionalGuidanceCost} 
            />
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-2">
                <label>קורס פטור בהנהלת חשבונות:</label>
                <select 
                  value={includeAccounting ? "yes" : "no"} 
                  onChange={(e) => setIncludeAccounting(e.target.value === "yes")}
                  className="border rounded p-1"
                >
                  <option value="no">לא כולל</option>
                  <option value="yes">כולל</option>
                </select>
              </div>
              <span className="text-left">{(includeAccounting ? COSTS.accountingExemption : 0).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-2">
                <label>קורסי אנגלית:</label>
                <select 
                  value={englishCourses} 
                  onChange={(e) => setEnglishCourses(Number(e.target.value))}
                  className="border rounded p-1"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <span className="text-left">{(englishCourses * COSTS.englishCourse).toLocaleString()}</span>
            </div>
            <SummaryRow 
              label="הרשמה ללימודים" 
              value={COSTS.registration} 
            />
            <SummaryRow 
              label={`ארגון סטודנטים (${studyYears} שנים)`} 
              value={COSTS.studentOrg * studyYears} 
            />
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
          </CardContent>
        </Card>

        {/* Total Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>סה״כ עלות התואר</CardTitle>
          </CardHeader>
          <CardContent>
            <SummaryRow 
              label="עלויות עיקריות" 
              value={totalMainCost} 
            />
            <SummaryRow 
              label="עלויות נוספות" 
              value={
                totalAdditionalCost + 
                (englishCourses * COSTS.englishCourse) + 
                (includeAccounting ? COSTS.accountingExemption : 0) + 
                COSTS.registration + 
                (COSTS.studentOrg * studyYears)
              } 
            />
            <SummaryRow 
              label="סה״כ עלות התואר" 
              value={
                totalMainCost + 
                totalAdditionalCost + 
                (englishCourses * COSTS.englishCourse) + 
                (includeAccounting ? COSTS.accountingExemption : 0) + 
                COSTS.registration + 
                (COSTS.studentOrg * studyYears)
              } 
              isTotal 
            />
          </CardContent>
        </Card>

        {/* Course Selection Grid */}
        <Card>
          <CardHeader>
            <CardTitle>בחירת קורסים להנחייה מוגברת</CardTitle>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleSelectAllCourses(true)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                בחר הכל
              </button>
              <button 
                onClick={() => handleSelectAllCourses(false)}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                נקה הכל
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {syllabusData.map(year => 
                Object.values(year.semesters).flat().map(course => 
                  course.courseNumber && !course.courseNumber.includes('אנגלית') && (
                    <div key={course.id} className="flex items-center space-x-2">
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
                        {course.name}
                      </label>
                    </div>
                  )
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 