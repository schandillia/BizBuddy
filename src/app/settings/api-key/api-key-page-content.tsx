// app/settings/api-key/api-key-page-content.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon, RefreshCwIcon } from "lucide-react"
import { useState } from "react"

export const ApiKeyPageContent = ({
  apiKey,
  onRegenerateKey,
}: {
  apiKey: string
  onRegenerateKey: () => Promise<void>
}) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleRegenerate = async () => {
    if (
      window.confirm(
        "Are you sure you want to regenerate your API key? Your old key will stop working immediately."
      )
    ) {
      setIsRegenerating(true)
      try {
        await onRegenerateKey()
      } catch (error) {
        console.error("Failed to regenerate API key:", error)
      } finally {
        setIsRegenerating(false)
      }
    }
  }

  return (
    <Card className="max-w-xl w-full">
      <div className="p-6">
        <Label className="dark:text-gray-400">Your API Key</Label>
        <div className="mt-1 relative">
          <Input
            type="password"
            value={apiKey}
            readOnly
            className="pr-12" // Add right padding for the button
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              variant="ghost"
              onClick={copyApiKey}
              className="h-8 w-8 p-0"
            >
              {copySuccess ? (
                <CheckIcon className="h-4 w-4 text-brand-900 dark:text-brand-700" />
              ) : (
                <ClipboardIcon className="h-4 w-4 text-brand-900 dark:text-brand-700" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm/6 text-gray-600 dark:text-gray-300 text-pretty pr-4 border-r-2 border-black/20 dark:border-black/20">
            Your API key is sensitive and provides access to your account. Treat
            it like a password—do not share it or expose it publicly. If you
            regenerate the key, the current key will become invalid, potentially
            disrupting services using it. Be sure to update all your
            applications with the new key.
          </p>
          <Button
            variant="destructive"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="ml-4"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            {isRegenerating ? "Regenerating..." : "Regenerate Key"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
