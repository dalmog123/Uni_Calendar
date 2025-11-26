"use client"

import { Card, CardContent } from "@/components/ui/card"
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
  Home,
  ArrowRight,
  ChevronRight,
  Loader2
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
        icon: <File className="h-6 w-6 text-white" />,
        text: "PDF",
        gradient: "from-red-500 to-pink-600",
        bg: "bg-red-50 text-red-600"
      }
    case mimeType.includes("spreadsheet") || mimeType.includes("excel"):
      return {
        icon: <Table className="h-6 w-6 text-white" />,
        text: "Excel",
        gradient: "from-emerald-500 to-green-600",
        bg: "bg-emerald-50 text-emerald-600"
      }
    case mimeType.includes("document") || mimeType.includes("word"):
      return {
        icon: <FileText className="h-6 w-6 text-white" />,
        text: "Word",
        gradient: "from-blue-500 to-indigo-600",
        bg: "bg-blue-50 text-blue-600"
      }
    case mimeType.includes("image"):
      return {
        icon: <ImageIcon className="h-6 w-6 text-white" />,
        text: "תמונה",
        gradient: "from-purple-500 to-violet-600",
        bg: "bg-purple-50 text-purple-600"
      }
    case mimeType.includes("video"):
      return {
        icon: <Video className="h-6 w-6 text-white" />,
        text: "סרטון",
        gradient: "from-pink-500 to-rose-600",
        bg: "bg-pink-50 text-pink-600"
      }
    case mimeType.includes("zip") || mimeType.includes("archive"):
      return {
        icon: <Archive className="h-6 w-6 text-white" />,
        text: "ארכיון",
        gradient: "from-yellow-500 to-amber-600",
        bg: "bg-yellow-50 text-yellow-600"
      }
    default:
      return {
        icon: <FileIcon className="h-6 w-6 text-white" />,
        text: "קובץ",
        gradient: "from-slate-500 to-gray-600",
        bg: "bg-slate-50 text-slate-600"
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
    color: "text-blue-600"
  },
  {
    id: "tax",
    name: "מיסים",
    courses: ["10870", "10871", "10872", "10873"],
    gradient: "from-purple-500 to-pink-500",
    color: "text-purple-600"
  },
  {
    id: "audit",
    name: "ביקורת",
    courses: ["10874", "10875", "10876"],
    gradient: "from-emerald-500 to-teal-500",
    color: "text-emerald-600"
  },
  {
    id: "law",
    name: "משפט",
    courses: ["10836", "10877"],
    gradient: "from-orange-500 to-red-500",
    color: "text-orange-600"
  },
  {
    id: "it",
    name: "מערכות מידע",
    courses: ["10645", "10878", "10596"],
    gradient: "from-indigo-500 to-violet-500",
    color: "text-indigo-600"
  },
    {
    id: "interdisciplinary",
    name: "בינתחומיים",
    courses: ["10860", "10861", "10862"],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "economics",
    name: "כלכלה",
    courses: ["10131", "10126", "10230", "10284", "10887"],
    gradient: "from-rose-500 to-pink-500",
    color: "text-rose-600"
  },
  {
    id: "foundation",
    name: "תשתית",
    courses: ["10142", "30111", "30112", "91419"],
    gradient: "from-amber-500 to-orange-500",
    color: "text-amber-600"
  },
]

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolderId, setCurrentFolderId] = useState<string>("1TRIeBJBEHbUqECwKwDGXoSfqRmRlajhI")
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchItems(currentFolderId)
  }, [currentFolderId])

  async function fetchItems(folderId: string) {
    setLoading(true)

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
    }
  }

  const handleItemClick = (item: DriveItem) => {
    if (item.type === "folder") {
      if (folderPath.length === 0 || folderPath[folderPath.length - 1].id !== item.id) {
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
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden relative" dir="rtl">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-200/20 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] rounded-full bg-emerald-100/30 blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            חומרי לימוד
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            מאגר סיכומים, מבחנים וחומר עזר מקהילת הסטודנטים
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8 z-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
            <div className="relative flex items-center bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 hover:border-blue-200 transition-all duration-300">
              <Search className="absolute right-4 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="חיפוש קורס, סיכום או קובץ..."
                className="border-0 bg-transparent h-14 pr-12 pl-12 text-lg focus-visible:ring-0 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {folderPath.length > 0 ? (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto py-2 px-1 scrollbar-hide">
            <button
              onClick={() => navigateToFolder(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm text-sm whitespace-nowrap"
            >
              <Home className="h-3.5 w-3.5" />
              <span>ראשי</span>
            </button>
            
            {folderPath.map((folder, index) => (
              <div key={`${folder.id}-${index}`} className="flex items-center gap-1 flex-shrink-0">
                <ChevronLeft className="h-4 w-4 text-slate-300" />
                <button
                  onClick={() => navigateToFolder(index + 1)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all shadow-sm border ${
                    index === folderPath.length - 1
                      ? "bg-blue-600 text-white border-blue-600 font-medium cursor-default"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  }`}
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Category Filters */
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {COURSE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterClick(category.id)}
                className={`relative group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeFilter === category.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md"
                }`}
              >
                {activeFilter === category.id && (
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                )}
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <Card className="bg-white/60 backdrop-blur-sm border-dashed border-2 border-slate-200 shadow-none mb-12">
            <CardContent className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">טוען חומרי לימוד...</h3>
              <p className="text-slate-500 text-sm">אנא המתן בזמן שאנחנו מביאים את הקבצים מ-Google Drive</p>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-sm border-dashed border-2 border-slate-200 shadow-none mb-12">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Library className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">לא נמצאו פריטים</h3>
              <p className="text-slate-500 text-sm">
                {searchQuery ? "נסה לשנות את מילות החיפוש" : "התיקייה הזו ריקה כרגע"}
              </p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-blue-600"
                >
                  נקה חיפוש
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filteredItems.map((item) => {
              const fileInfo = item.type === "file" ? getFileIcon(item.mimeType) : null

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group relative text-right w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-3xl"
                >
                  <Card className="h-full bg-white/80 backdrop-blur-md border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-50" />
                    <CardContent className="p-5 relative z-10 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        {item.type === "folder" ? (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <FolderIcon className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${fileInfo?.gradient} flex items-center justify-center shadow-lg shadow-gray-500/20 group-hover:scale-110 transition-transform duration-300`}
                          >
                            {fileInfo?.icon}
                          </div>
                        )}
                        
                        {item.type === "folder" ? (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <ArrowRight className="h-4 w-4 rotate-180" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                            <Download className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.type === "folder" ? "תיקייה" : fileInfo?.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        )}

        {/* Share Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-100 mb-2">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">תרומה לקהילה</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">יש לכם סיכומים מעולים?</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                שתפו אותם עם הקהילה ועזרו לסטודנטים אחרים להצליח. המאגר מתבסס על שיתוף ידע הדדי.
              </p>
            </div>
            
            <Button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSfOQA7zNgV_Iu8oFdt4khlmDFGOBkxIXHiKtcUEUH_tYeHeJw/viewform",
                  "_blank",
                )
              }
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold border-0"
            >
              שתף חומרי לימוד

            </Button>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          * הקבצים מוצגים מתוך Google Drive המנוהל על ידי הסטודנטים. אין האתר אחראי על התוכן.
        </p>
      </div>
    </div>
  )
}