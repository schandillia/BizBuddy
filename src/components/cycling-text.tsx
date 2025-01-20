"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/utils" // Make sure you have this utility function

interface CyclingTextProps {
  words: string[] // Array of words to cycle through
  interval?: number // Optional: Interval in milliseconds (default is 1000ms)
  className?: string // Optional: Custom className
  containerClassName?: string // Optional: Custom className for the outer container
}

const CyclingText: React.FC<CyclingTextProps> = ({
  words,
  interval = 1000,
  className,
  containerClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <span className={cn("inline-flex h-8", containerClassName)}>
      <span
        className={cn(
          "h-8 flex items-center text-gray-600 dark:text-gray-400",
          className
        )}
      >
        {words[currentIndex]}
      </span>
    </span>
  )
}

export default CyclingText
