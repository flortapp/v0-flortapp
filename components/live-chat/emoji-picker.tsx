"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void
  onClickOutside?: () => void
}

export function EmojiPicker({ onEmojiSelect, onClickOutside }: EmojiPickerProps) {
  const { theme } = useTheme()
  const pickerRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    if (!onClickOutside) return

    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClickOutside()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClickOutside])

  // Custom styling to match our app's design
  const customStyles = {
    "--em-rgb-input": theme === "dark" ? "54, 54, 82" : "255, 255, 255",
    "--em-rgb-background": theme === "dark" ? "23, 24, 41" : "255, 255, 255",
    "--em-rgb-category-background": theme === "dark" ? "26, 27, 46" : "239, 241, 250",
    "--em-rgb-accent": "250, 38, 116",
    "--em-rgb-border": theme === "dark" ? "64, 65, 87" : "227, 227, 227",
  } as React.CSSProperties

  return (
    <div ref={pickerRef} className="emoji-picker-container">
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme={theme === "dark" ? "dark" : "light"}
        previewPosition="none"
        skinTonePosition="search"
        searchPosition="sticky"
        navPosition="bottom"
        perLine={8}
        maxFrequentRows={1}
        style={customStyles}
      />
    </div>
  )
}
