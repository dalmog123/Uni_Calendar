"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface Course {
  id: string
  name: string
  folderId: string
}

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFolders() {
      try {
        const response = await fetch('/api/drive-folders')
        const data = await response.json()
        console.log('API Response:', data)
        
        if (data.error) {
          console.error('API Error:', data.error, data.details)
          setCourses([])
          return
        }
        
        if (Array.isArray(data)) {
          setCourses(data)
        } else {
          console.error('Received invalid data format:', data)
          setCourses([])
        }
      } catch (error) {
        console.error('Error fetching folders:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchFolders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
        <div>טוען...</div>
      </div>
    )
  }

  const filteredCourses = Array.isArray(courses) 
    ? courses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
      <div className="space-y-6 mb-16">
        <h1 className="text-4xl font-bold">חומרי לימוד</h1>
        <p className="text-xl text-gray-600">
          גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים
        </p>
      </div>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="חיפוש קורס..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <a 
            key={course.id} 
            href={`https://drive.google.com/drive/folders/${course.folderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="hover:shadow-lg transition-all hover:scale-102 h-full flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderIcon className="h-5 w-5 flex-shrink-0" />
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  לחץ לצפייה בחומרי הקורס
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
} 