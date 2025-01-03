"use client"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import clsx from "clsx"
import { useTheme } from "next-themes"

type Theme = "LIGHT" | "DARK" | "SYSTEM"

interface AppearanceSettingsProps {
  preferredTheme: Theme
}

const themes: { value: Theme; label: string }[] = [
  { value: "LIGHT", label: "Light" },
  { value: "DARK", label: "Dark" },
  { value: "SYSTEM", label: "System" },
]

export const AppearanceSettings = ({
  preferredTheme: initialPreferredTheme,
}: AppearanceSettingsProps) => {
  const [preferredTheme, setPreferredTheme] = useState<Theme>(
    initialPreferredTheme
  )
  const { setTheme } = useTheme() // Move useTheme hook to component level

  const { mutate, isPending } = useMutation({
    mutationFn: async (theme: Theme) => {
      const res = await client.project.setPreferredTheme.$post({
        theme,
      })
      return res.json()
    },
    onSuccess: (_, theme) => {
      // Update the theme using setTheme from useTheme hook
      setTheme(theme.toLowerCase())
      // Optional: Show success toast/message
    },
    onError: (error) => {
      console.error("Failed to update theme:", error)
      // Optional: Show error toast/message
    },
  })

  const handleThemeChange = (value: Theme) => {
    setPreferredTheme(value)
    mutate(value)
  }

  return (
    <Card className="max-w-xl w-full p-6">
      <div className="space-y-4">
        <Label className="dark:text-gray-400">Preferred Theme</Label>
        <RadioGroup
          value={preferredTheme}
          onValueChange={handleThemeChange}
          className={clsx(
            "mt-2 flex space-x-4",
            isPending && "opacity-50 pointer-events-none"
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
  )
}
