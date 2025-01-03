"use client"

import * as React from "react"
import { Computer, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { isSignedIn } = useAuth()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme ?? "system")
    const nextIndex = (currentIndex + 1) % themes.length
    const newTheme = themes[nextIndex]
    setTheme(newTheme)

    // Only update localStorage if user is not logged in
    if (!isSignedIn) {
      localStorage.setItem("theme", newTheme)
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = theme ?? "system"

  return (
    <Button
      className="rounded-full hover:opacity-80"
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle theme"
    >
      {currentTheme === "light" && <Sun className="size-4" strokeWidth={1.5} />}
      {currentTheme === "dark" && (
        <MoonStar className="size-4" strokeWidth={1.5} />
      )}
      {currentTheme === "system" && (
        <Computer className="size-4" strokeWidth={1.5} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
