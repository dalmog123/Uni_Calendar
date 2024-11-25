"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FolderIcon, 
  FileIcon, 
  FileText, 
  Image, 
  Video, 
  File,
  Archive,
  ChevronLeft,
  Table,
  X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DriveItem {
  id: string
  name: string
  type: 'folder' | 'file'
  mimeType: string
}

// Helper function to determine file icon and color
const getFileIcon = (mimeType: string) => {
  switch (true) {
    case mimeType.includes('pdf'):
      return {
        icon: <File className="h-5 w-5 flex-shrink-0 text-red-500" />,
        text: 'PDF'
      }
    case mimeType.includes('spreadsheet') || mimeType.includes('excel'):
      return {
        icon: <Table className="h-5 w-5 flex-shrink-0 text-green-600" />,
        text: 'Excel'
      }
    case mimeType.includes('document') || mimeType.includes('word'):
      return {
        icon: <FileText className="h-5 w-5 flex-shrink-0 text-blue-600" />,
        text: 'Word'
      }
    case mimeType.includes('image'):
      return {
        icon: <Image className="h-5 w-5 flex-shrink-0 text-purple-500" />,
        text: 'תמונה'
      }
    case mimeType.includes('video'):
      return {
        icon: <Video className="h-5 w-5 flex-shrink-0 text-pink-500" />,
        text: 'סרטון'
      }
    case mimeType.includes('zip') || mimeType.includes('archive'):
      return {
        icon: <Archive className="h-5 w-5 flex-shrink-0 text-yellow-600" />,
        text: 'קובץ דחוס'
      }
    default:
      return {
        icon: <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />,
        text: 'קובץ'
      }
  }
}

// Add this constant for the course numbers
const FINANCIAL_ACCOUNTING_COURSES = ["10863", "10864", "10865", "10866", "10867", "10868"]
const TAX_COURSES = ["10870", "10871", "10872", "10873"]
const AUDIT_COURSES = ["10874", "10875", "10876"]
const LAW_COURSES = ["10836", "10877"]
const IT_COURSES = ["10645", "10878", "10596"]
const INTERDISCIPLINARY_COURSES = ["10860", "10861", "10862"]
const ECONOMICS_FINANCE_COURSES = ["10131", "10126", "10230", "10284", "10887"]
const FOUNDATION_COURSES = ["10142", "30111", "30112", "91419"]

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [currentFolderId, setCurrentFolderId] = useState<string>("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
  const [folderPath, setFolderPath] = useState<Array<{ id: string, name: string }>>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchItems(currentFolderId)
  }, [currentFolderId])

  async function fetchItems(folderId: string) {
    if (isInitialLoad) {
      setLoading(true)
    }

    try {
      const response = await fetch(`/api/drive-items?folderId=${folderId}`)
      const data = await response.json()
      
      if (data.error) {
        console.error('API Error:', data.error, data.details)
        setItems([])
        return
      }
      
      if (Array.isArray(data)) {
        setItems(data)
      } else {
        console.error('Received invalid data format:', data)
        setItems([])
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }

  const handleItemClick = (item: DriveItem) => {
    if (item.type === 'folder') {
      if (folderPath.length === 0 || folderPath[folderPath.length - 1].id !== item.id) {
        setLoading(true);
        const newPath = [...folderPath, { id: item.id, name: item.name }];
        setFolderPath(newPath);
        setCurrentFolderId(item.id);
        setSearchQuery("");
      }
    } else {
      window.open(`https://drive.google.com/file/d/${item.id}/view`, '_blank')
    }
  }

  const navigateToFolder = (index: number) => {
    if (index === folderPath.length) return;
    
    if (index === 0) {
      setFolderPath([])
      setCurrentFolderId("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
    } else {
      const newPath = folderPath.slice(0, index)
      setFolderPath(newPath)
      setCurrentFolderId(folderPath[index - 1].id)
    }
  }

  // Modify the filter handling to include tax courses
  const handleFilterClick = (filterType: string) => {
    setSearchQuery("")
    if (activeFilter === filterType) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filterType)
    }
  }

  // Modify the filtering logic to only apply filters at the root level
  const filteredItems = items.filter(item => {
    // If we're in a subfolder (folderPath.length > 0), show all items
    if (folderPath.length > 0) {
      if (searchQuery) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    }

    // Only apply course filters at the root level
    if (activeFilter) {
      const coursesToFilter = 
        activeFilter === 'financial' ? FINANCIAL_ACCOUNTING_COURSES 
        : activeFilter === 'tax' ? TAX_COURSES
        : activeFilter === 'audit' ? AUDIT_COURSES
        : activeFilter === 'law' ? LAW_COURSES
        : activeFilter === 'it' ? IT_COURSES
        : activeFilter === 'interdisciplinary' ? INTERDISCIPLINARY_COURSES
        : activeFilter === 'economics' ? ECONOMICS_FINANCE_COURSES
        : FOUNDATION_COURSES
      const filterPattern = coursesToFilter.join("|")
      const regex = new RegExp(filterPattern)
      if (!regex.test(item.name)) return false
    }
    
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    
    return true
  })

  return (
    <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
      <div className="space-y-6 mb-16">
        <h1 className="text-4xl font-bold">חומרי לימוד</h1>
        <p className="text-xl text-gray-600">
          גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button 
          onClick={() => navigateToFolder(0)}
          className="hover:text-primary"
        >
          דף ראשי
        </button>
        {folderPath.map((folder, index) => (
          <div key={`${folder.id}-${index}`} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <button 
              onClick={() => navigateToFolder(index + 1)}
              className="hover:text-primary"
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>

      <div className="mb-8 relative max-w-md">
        <Input
          type="text"
          placeholder="חיפוש..."
          className="pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={activeFilter === 'financial' ? "default" : "outline"}
          onClick={() => handleFilterClick('financial')}
          className="text-[15px] md:text-sm"
        >
          חשבונאות פיננסית
        </Button>
        <Button 
          variant={activeFilter === 'tax' ? "default" : "outline"}
          onClick={() => handleFilterClick('tax')}
          className="text-[15px] md:text-sm"
        >
          מיסים
        </Button>
        <Button 
          variant={activeFilter === 'audit' ? "default" : "outline"}
          onClick={() => handleFilterClick('audit')}
          className="text-[15px] md:text-sm"
        >
          ביקורת חשבונות
        </Button>
        <Button 
          variant={activeFilter === 'law' ? "default" : "outline"}
          onClick={() => handleFilterClick('law')}
          className="text-[15px] md:text-sm"
        >
          משפט
        </Button>
        <Button 
          variant={activeFilter === 'it' ? "default" : "outline"}
          onClick={() => handleFilterClick('it')}
          className="text-[15px] md:text-sm"
        >
          מערכות מידע ואבטחת סייבר
        </Button>
        <Button 
          variant={activeFilter === 'interdisciplinary' ? "default" : "outline"}
          onClick={() => handleFilterClick('interdisciplinary')}
          className="text-[15px] md:text-sm"
        >
          לימודים בינתחומיים בכלכלה ניהול וחשבונאות
        </Button>
        <Button 
          variant={activeFilter === 'economics' ? "default" : "outline"}
          onClick={() => handleFilterClick('economics')}
          className="text-[15px] md:text-sm"
        >
          כלכלה ומימון
        </Button>
        <Button 
          variant={activeFilter === 'foundation' ? "default" : "outline"}
          onClick={() => handleFilterClick('foundation')}
          className="text-[15px] md:text-sm"
        >
          לימודי תשתית
        </Button>
      </div>

      {loading ? (
        <div className="text-center">טוען...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-500">
          {searchQuery 
            ? "לא נמצאו תוצאות לחיפוש זה" 
            : "התיקייה ריקה"}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="text-left w-full"
            >
              <Card className={`
                hover:shadow-lg transition-all hover:scale-102 h-full flex flex-col
                ${item.type === 'file' ? 'bg-gray-50' : ''} 
              `}>
                <CardHeader className="flex-grow">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {item.type === 'folder' ? (
                      <FolderIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    ) : (
                      getFileIcon(item.mimeType).icon
                    )}
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`text-sm ${
                    item.type === 'file' 
                      ? 'text-gray-600' 
                      : 'text-gray-500'
                  }`}>
                    {item.type === 'folder' 
                      ? 'לחץ לפתיחת התיקייה' 
                      : `לחץ לפתיחת ${getFileIcon(item.mimeType).text}`
                    }
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 