"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FolderIcon,
  FileIcon,
  FileText,
  ImageIcon,
  Video,
  File,
  Archive,
  ChevronLeft,
  Table,
  X,
  Search,
  Library,
  Filter,
  Share2,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DriveItem {
  id: string
  name: string
  type: "folder" | "file"
  mimeType: string
}

// Helper function to determine file icon and color
const getFileIcon = (mimeType: string) => {
  switch (true) {
    case mimeType.includes("pdf"):
      return {
        icon: <File className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "PDF",
        gradient: "from-red-500 to-pink-500",
      }
    case mimeType.includes("spreadsheet") || mimeType.includes("excel"):
      return {
        icon: <Table className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "Excel",
        gradient: "from-green-500 to-emerald-500",
      }
    case mimeType.includes("document") || mimeType.includes("word"):
      return {
        icon: <FileText className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "Word",
        gradient: "from-blue-500 to-cyan-500",
      }
    case mimeType.includes("image"):
      return {
        icon: <ImageIcon className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "תמונה",
        gradient: "from-purple-500 to-pink-500",
      }
    case mimeType.includes("video"):
      return {
        icon: <Video className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "סרטון",
        gradient: "from-pink-500 to-rose-500",
      }
    case mimeType.includes("zip") || mimeType.includes("archive"):
      return {
        icon: <Archive className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "קובץ דחוס",
        gradient: "from-yellow-500 to-orange-500",
      }
    default:
      return {
        icon: <FileIcon className="h-5 w-5 flex-shrink-0 text-white" />,
        text: "קובץ",
        gradient: "from-gray-500 to-slate-500",
      }
  }
}

// Course categories with their gradients
const COURSE_CATEGORIES = [
  {
    id: "financial",
    name: "חשבונאות פיננסית",
    courses: ["10863", "10864", "10865", "10866", "10867", "10868"],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "tax",
    name: "מיסים",
    courses: ["10870", "10871", "10872", "10873"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "audit",
    name: "ביקורת חשבונות",
    courses: ["10874", "10875", "10876"],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "law",
    name: "משפט",
    courses: ["10836", "10877"],
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "it",
    name: "מערכות מידע ואבטחת סייבר",
    courses: ["10645", "10878", "10596"],
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "interdisciplinary",
    name: "לימודים בינתחומיים",
    courses: ["10860", "10861", "10862"],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "economics",
    name: "כלכלה ומימון",
    courses: ["10131", "10126", "10230", "10284", "10887"],
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "foundation",
    name: "לימודי תשתית",
    courses: ["10142", "30111", "30112", "91419"],
    gradient: "from-amber-500 to-orange-500",
  },
]

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [currentFolderId, setCurrentFolderId] = useState<string>("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])
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
        console.error("API Error:", data.error, data.details)
        setItems([])
        return
      }

      if (Array.isArray(data)) {
        setItems(data)
      } else {
        console.error("Received invalid data format:", data)
        setItems([])
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      setItems([])
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }

  const handleItemClick = (item: DriveItem) => {
    if (item.type === "folder") {
      if (folderPath.length === 0 || folderPath[folderPath.length - 1].id !== item.id) {
        setLoading(true)
        const newPath = [...folderPath, { id: item.id, name: item.name }]
        setFolderPath(newPath)
        setCurrentFolderId(item.id)
        setSearchQuery("")
      }
    } else {
      window.open(`https://drive.google.com/file/d/${item.id}/view`, "_blank")
    }
  }

  const navigateToFolder = (index: number) => {
    if (index === folderPath.length) return

    if (index === 0) {
      setFolderPath([])
      setCurrentFolderId("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
    } else {
      const newPath = folderPath.slice(0, index)
      setFolderPath(newPath)
      setCurrentFolderId(folderPath[index - 1].id)
    }
  }

  const handleFilterClick = (filterType: string) => {
    setSearchQuery("")
    if (activeFilter === filterType) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filterType)
    }
  }

  const filteredItems = items.filter((item) => {
    // If we're in a subfolder, show all items
    if (folderPath.length > 0) {
      if (searchQuery) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    }

    // Only apply course filters at the root level
    if (activeFilter) {
      const category = COURSE_CATEGORIES.find((cat) => cat.id === activeFilter)
      if (category) {
        const filterPattern = category.courses.join("|")
        const regex = new RegExp(filterPattern)
        if (!regex.test(item.name)) return false
      }
    }

    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              חומרי לימוד
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            גישה מהירה לחומרי הלימוד וסיכומים של סטודנטים אחרים
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        {folderPath.length > 0 && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => navigateToFolder(0)}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  דף ראשי
                </button>
                {folderPath.map((folder, index) => (
                  <div key={`${folder.id}-${index}`} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                    <button
                      onClick={() => navigateToFolder(index + 1)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {folder.name}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="חיפוש קבצים ותיקיות..."
                  className="pr-10 pl-10 h-12 text-lg border-slate-300 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filter Buttons */}
          {folderPath.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  סינון לפי נושא
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {COURSE_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => handleFilterClick(category.id)}
                      className={`h-auto p-4 text-right transition-all duration-300 hover:scale-105 ${
                        activeFilter === category.id
                          ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg`
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                      variant="ghost"
                    >
                      <div className="text-sm font-medium leading-relaxed">{category.name}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 animate-pulse"></div>
              <div className="text-slate-600 text-lg">טוען חומרי לימוד...</div>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <Library className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <div className="text-slate-500 text-lg">{searchQuery ? "לא נמצאו תוצאות לחיפוש זה" : "התיקייה ריקה"}</div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredItems.map((item) => {
                const fileInfo = item.type === "file" ? getFileIcon(item.mimeType) : null

                return (
                  <button key={item.id} onClick={() => handleItemClick(item)} className="text-right w-full group">
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 group-hover:border-slate-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-3">
                          {item.type === "folder" ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <FolderIcon className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fileInfo?.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            >
                              {fileInfo?.icon && <div className="text-white">{fileInfo.icon}</div>}
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg text-slate-800 group-hover:text-slate-900 leading-relaxed text-right">
                              {item.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-700">
                          {item.type === "folder" ? (
                            <>
                              <FolderIcon className="h-4 w-4" />
                              <span className="text-sm">לחץ לפתיחת התיקייה</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span className="text-sm">לחץ לפתיחת {fileInfo?.text}</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                )
              })}
            </div>

            {/* Share Materials Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">שתף חומרי לימוד</h3>
                </div>

                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  יש לך חומרי לימוד שיכולים לעזור לסטודנטים אחרים? שתף אותם עם הקהילה!
                </p>

                <Button
                  onClick={() =>
                    window.open(
                      "https://docs.google.com/forms/d/e/1FAIpQLSfOQA7zNgV_Iu8oFdt4khlmDFGOBkxIXHiKtcUEUH_tYeHeJw/viewform",
                      "_blank",
                    )
                  }
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="h-5 w-5 ml-2" />
                  שתף חומרי לימוד
                </Button>

                <p className="text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
                  כל הקבצים המוצגים כאן הם ייצוג ויזואלי של תיקיית Google Drive המנוהלת על ידי הסטודנטים. האתר אינו
                  אחראי על הפרת זכויות יוצרים כלשהי
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
