"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useState } from "react"

export const ApiKeySettings = ({ apiKey }: { apiKey: string }) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label className="dark:text-gray-400">Your API Key</Label>
        <div className="mt-1 relative">
          <Input type="password" value={apiKey} readOnly />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              onClick={copyApiKey}
              className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-700"
            >
              {copySuccess ? (
                <CheckIcon className="size-4 text-brand-900 dark:text-brand-700" />
              ) : (
                <ClipboardIcon className="size-4 text-brand-900 dark:text-brand-700" />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-300">
          Keep your key secret and do not share it with others.
        </p>
      </div>
    </Card>
  )
}
