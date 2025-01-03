"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

type Theme = "LIGHT" | "DARK" | "SYSTEM"

interface AppearanceSettingsProps {
  preferredTheme: Theme
}

export const AppearanceSettings = ({
  preferredTheme: initialPreferredTheme,
}: AppearanceSettingsProps) => {
  const [preferredTheme, setPreferredTheme] = useState<Theme>(
    initialPreferredTheme
  )

  const { mutate, isPending } = useMutation({
    mutationFn: async (theme: Theme) => {
      const res = await client.project.setPreferredTheme.$post({
        theme,
      })
      return res.json()
    },
    onSuccess: () => {
      // Optional: Show success toast/message
    },
    onError: (error) => {
      console.error("Failed to update theme:", error)
      // Optional: Show error toast/message
    },
  })

  return (
    <Card className="max-w-xl w-full p-6">
      <div className="space-y-4">
        <div>
          <Label className="dark:text-gray-400">Preferred Theme</Label>
          <Select
            value={preferredTheme}
            onValueChange={(value: Theme) => setPreferredTheme(value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LIGHT">Light</SelectItem>
              <SelectItem value="DARK">Dark</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={() => mutate(preferredTheme)} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
