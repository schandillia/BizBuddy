"use client"

import React, { useState, useEffect } from "react"

interface CyclingTextProps {
  words: string[] // Array of words to cycle through
  interval?: number // Optional: Interval in milliseconds (default is 1000ms)
}

const CyclingText: React.FC<CyclingTextProps> = ({
  words,
  interval = 1000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <span className="inline-flex h-8">
      <span className="h-8 flex items-center text-gray-600 dark:text-gray-400">
        {words[currentIndex]}
      </span>
    </span>
  )
}

export default CyclingText
