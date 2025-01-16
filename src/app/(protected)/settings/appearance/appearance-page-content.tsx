"use client"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import clsx from "clsx"
import { useTheme } from "next-themes"
import { Slider } from "@/components/ui/slider"

type Theme = "LIGHT" | "DARK" | "SYSTEM"

interface AppearancePageContentProps {
  preferredTheme: Theme
  preferredFontSize: number
}

const themes: { value: Theme; label: string }[] = [
  { value: "LIGHT", label: "Light" },
  { value: "DARK", label: "Dark" },
  { value: "SYSTEM", label: "Auto" },
]

export const AppearancePageContent = ({
  preferredTheme: initialPreferredTheme,
  preferredFontSize: initialPreferredFontSize,
}: AppearancePageContentProps) => {
  const [preferredTheme, setPreferredTheme] = useState<Theme>(
    initialPreferredTheme
  )
  const [fontSize, setFontSize] = useState<number>(initialPreferredFontSize)
  const { setTheme } = useTheme()

  // Theme mutation
  const { mutate: mutateTheme, isPending: isThemePending } = useMutation({
    mutationFn: async (theme: Theme) => {
      const res = await client.project.setPreferredTheme.$post({
        theme,
      })
      return res.json()
    },
    onSuccess: (_, theme) => {
      setTheme(theme.toLowerCase())
    },
    onError: (error) => {
      console.error("Failed to update theme:", error)
    },
  })

  // Font size mutation
  const { mutate: mutateFontSize, isPending: isFontSizePending } = useMutation({
    mutationFn: async (fontSize: number) => {
      const res = await client.project.setPreferredFontSize.$post({
        fontSize,
      })
      return res.json()
    },
    onSuccess: (fontSize) => {
      document.documentElement.style.setProperty(
        "--base-font-size",
        `${fontSize}px`
      )
    },
    onError: (error) => {
      console.error("Failed to update font size:", error)
    },
  })

  const handleThemeChange = (value: Theme) => {
    setPreferredTheme(value)
    mutateTheme(value)
  }

  const handleFontSizeChange = (values: number[]) => {
    const newSize = values[0]
    setFontSize(newSize)
    mutateFontSize(newSize)
  }

  return (
    <div className="space-y-6">
      {/* Theme selection */}
      <Card className="max-w-xl w-full p-6">
        <div className="space-y-4">
          <Label className="dark:text-gray-400">Preferred Theme</Label>
          <RadioGroup
            value={preferredTheme}
            onValueChange={handleThemeChange}
            className={clsx(
              "mt-2 flex space-x-4",
              isThemePending && "opacity-50 pointer-events-none"
            )}
          >
            {themes.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={value}
                  id={value}
                  className={clsx(
                    "relative w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center",
                    preferredTheme === value && "bg-black dark:bg-white"
                  )}
                >
                  {preferredTheme === value && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </RadioGroupItem>
                <Label htmlFor={value}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>

      {/* Font size selection */}
      <Card className="max-w-xl w-full p-6">
        <div className="space-y-4">
          <Label className="dark:text-gray-400">Font Size</Label>
          <div
            className={clsx(
              "flex items-center gap-4",
              isFontSizePending && "opacity-50 pointer-events-none"
            )}
          >
            <span className="text-xs text-gray-500">Aa</span>
            <Slider
              className="flex-1"
              min={12}
              max={18}
              step={2}
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
            />
            <span className="text-lg text-gray-500">Aa</span>
          </div>
          <div className="text-sm text-gray-500">
            Current size: {fontSize}px
          </div>
        </div>
      </Card>
    </div>
  )
}
