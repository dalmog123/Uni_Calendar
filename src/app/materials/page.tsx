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
  Table
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

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

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [currentFolderId, setCurrentFolderId] = useState<string>("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
  const [folderPath, setFolderPath] = useState<Array<{ id: string, name: string }>>([])

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
      setFolderPath(prev => [...prev, { id: item.id, name: item.name }])
      setCurrentFolderId(item.id)
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

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading && isInitialLoad) {
    return (
      <div className="container mx-auto p-4 py-12 max-w-7xl" dir="rtl">
        <div>טוען...</div>
      </div>
    )
  }

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

      <div className="mb-8">
        <Input
          type="text"
          placeholder="חיפוש..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
    </div>
  )
} 