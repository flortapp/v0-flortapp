"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, Smile, Heart, Car, Coffee, Flag, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Emoji categories
const categories = [
  { id: "recent", name: "Recent", icon: <Clock className="h-4 w-4" /> },
  { id: "smileys", name: "Smileys", icon: <Smile className="h-4 w-4" /> },
  { id: "people", name: "People", icon: <Heart className="h-4 w-4" /> },
  { id: "travel", name: "Travel", icon: <Car className="h-4 w-4" /> },
  { id: "food", name: "Food", icon: <Coffee className="h-4 w-4" /> },
  { id: "flags", name: "Flags", icon: <Flag className="h-4 w-4" /> },
]

// Sample emoji data - in a real app, this would be more comprehensive
const emojiData = {
  recent: ["😀", "😂", "❤️", "👍", "🔥", "✨", "🎉", "👏", "🙏", "🥰"],
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  people: ["👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👩‍🦱", "👨‍🦱", "👩‍🦰", "👨‍🦰", "👱‍♀️", "👱‍♂️", "👩‍🦳", "👨‍🦳"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝"],
  flags: ["🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🏳️‍⚧️", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶"],
}

interface CustomEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose?: () => void
}

export function CustomEmojiPicker({ onEmojiSelect, onClose }: CustomEmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [recentEmojis, setRecentEmojis] = useState<string[]>(emojiData.recent)
  const [previewEmoji, setPreviewEmoji] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load recent emojis from localStorage on component mount
  useEffect(() => {
    const storedRecents = localStorage.getItem("recentEmojis")
    if (storedRecents) {
      setRecentEmojis(JSON.parse(storedRecents))
    }
  }, [])

  // Save recent emojis to localStorage when they change
  useEffect(() => {
    localStorage.setItem("recentEmojis", JSON.stringify(recentEmojis))
  }, [recentEmojis])

  // Focus search input when category changes
  useEffect(() => {
    if (activeCategory === "search" && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [activeCategory])

  // Add cleanup for any potential memory leaks
  useEffect(() => {
    return () => {
      // Cleanup function
      setPreviewEmoji(null)
      setSearchQuery("")
    }
  }, [])

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji)

    // Add to recent emojis
    if (!recentEmojis.includes(emoji)) {
      const newRecents = [emoji, ...recentEmojis.slice(0, 9)]
      setRecentEmojis(newRecents)
    }

    // Optional auto-close
    // setShowPicker(false)
    // if (onClose) onClose()
  }

  // Filter emojis based on search query
  const filteredEmojis = searchQuery
    ? Object.values(emojiData)
        .flat()
        .filter((emoji) => emoji.includes(searchQuery))
    : []

  // Animation classes for the picker
  const pickerClasses = cn("bg-[#171829] border border-gray-700 rounded-lg overflow-hidden shadow-lg")

  return (
    <div className={pickerClasses} style={{ width: "300px" }}>
      {/* Header with search and close button */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-[#1a1b2e]">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Emoji ara..."
            className="pl-8 h-8 bg-[#171829] border-gray-700 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview area */}
      {previewEmoji && (
        <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-[#1a1b2e]">
          <div className="flex items-center">
            <span className="text-3xl mr-2">{previewEmoji}</span>
            <div className="text-xs text-gray-400">Eklemek için tıklayın</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs bg-[#fa2674] hover:bg-[#e01e65] text-white"
            onClick={() => handleEmojiSelect(previewEmoji)}
          >
            Ekle
          </Button>
        </div>
      )}

      {/* Tabs for categories */}
      <Tabs defaultValue="recent" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="border-b border-gray-700 bg-[#1a1b2e]">
          <div className="flex items-center justify-between px-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <TabsList className="h-10 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={`data-[state=active]:bg-[#fa2674] data-[state=active]:text-white px-2 py-1`}
                >
                  {category.icon}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search results */}
        {searchQuery && (
          <div className="p-2">
            <h3 className="text-xs text-gray-400 mb-2">Arama Sonuçları</h3>
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis.length > 0 ? (
                filteredEmojis.map((emoji, index) => (
                  <button
                    key={`search-${index}`}
                    className="h-8 w-8 flex items-center justify-center text-lg rounded hover:bg-[#2b2c46] transition-colors"
                    onClick={() => handleEmojiSelect(emoji)}
                    onMouseEnter={() => setPreviewEmoji(emoji)}
                    onMouseLeave={() => setPreviewEmoji(null)}
                  >
                    {emoji}
                  </button>
                ))
              ) : (
                <div className="col-span-8 text-center py-4 text-gray-400 text-sm">Emoji bulunamadı</div>
              )}
            </div>
          </div>
        )}

        {/* Category contents */}
        {!searchQuery && (
          <div className="h-[200px] overflow-y-auto">
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="p-2 m-0">
                <h3 className="text-xs text-gray-400 mb-2">{category.name}</h3>
                <div className="grid grid-cols-8 gap-1">
                  {emojiData[category.id as keyof typeof emojiData].map((emoji, index) => (
                    <button
                      key={`${category.id}-${index}`}
                      className="h-8 w-8 flex items-center justify-center text-lg rounded hover:bg-[#2b2c46] transition-colors"
                      onClick={() => handleEmojiSelect(emoji)}
                      onMouseEnter={() => setPreviewEmoji(emoji)}
                      onMouseLeave={() => setPreviewEmoji(null)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        )}

        {/* Footer with skin tone selector (simplified) */}
        <div className="p-2 border-t border-gray-700 bg-[#1a1b2e] flex justify-between items-center">
          <div className="flex space-x-1">
            <button className="h-6 w-6 rounded-full bg-[#f9d9bd] hover:ring-2 ring-[#fa2674]"></button>
            <button className="h-6 w-6 rounded-full bg-[#eac086] hover:ring-2 ring-[#fa2674]"></button>
            <button className="h-6 w-6 rounded-full bg-[#c88b61] hover:ring-2 ring-[#fa2674]"></button>
            <button className="h-6 w-6 rounded-full bg-[#a56941] hover:ring-2 ring-[#fa2674]"></button>
            <button className="h-6 w-6 rounded-full bg-[#6a462f] hover:ring-2 ring-[#fa2674]"></button>
          </div>
          <div className="text-xs text-gray-400">Powered by Kisstagram</div>
        </div>
      </Tabs>
    </div>
  )
}
