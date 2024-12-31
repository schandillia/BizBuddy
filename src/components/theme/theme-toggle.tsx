"use client"

import * as React from "react"

import { Computer, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Set mounted to true once the component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Function to cycle through the themes: light, dark, and system
  const cycleTheme = () => {
    const themes = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme ?? "system")
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Render an empty button before mounting to avoid hydration issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Icon mapping based on the current theme
  const ThemeIcon = {
    light: <Sun className="dark:text-white size-4" strokeWidth={1.5} />,
    dark: <MoonStar className="dark:text-white size-4" strokeWidth={1.5} />,
    system: <Computer className="dark:text-white size-4" strokeWidth={1.5} />,
  }

  // Use a default value for the theme in case it's undefined
  const currentTheme = theme ?? "light"

  return (
    <Button
      className="rounded-full hover:opacity-80"
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle theme"
    >
      {/* Render the appropriate icon based on the current theme */}
      {ThemeIcon[currentTheme as "light" | "dark" | "system"]}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
