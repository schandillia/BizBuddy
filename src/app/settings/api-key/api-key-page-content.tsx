"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon, RefreshCwIcon } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const ApiKeyPageContent = ({
  apiKey,
  onRegenerateKey,
}: {
  apiKey: string
  onRegenerateKey: () => Promise<void>
}) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      await onRegenerateKey()
    } catch (error) {
      console.error("Failed to regenerate API key:", error)
    } finally {
      setIsRegenerating(false)
      setIsModalOpen(false) // Close the modal after the action is performed
    }
  }

  return (
    <Card className="max-w-xl w-full">
      <div className="p-6">
        <Label className="dark:text-gray-400">Your API Key</Label>
        <div className="mt-1 relative">
          <Input
            type={apiKey ? "password" : "text"}
            value={apiKey || "Generating..."} // Show placeholder if apiKey is empty
            readOnly
            className={`pr-14 ${!apiKey ? "italic text-gray-500" : ""}`} // Style placeholder
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              variant="ghost"
              onClick={copyApiKey}
              className="h-8 w-8 p-0"
              disabled={!apiKey} // Disable copy button if apiKey is empty
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
          <p className="text-sm text-gray-500 text-pretty pr-4 border-r-2 border-black/10 dark:border-black/20">
            Your API key is sensitive and provides access to your account. Treat
            it like a password—do not share it or expose it publicly. If you
            regenerate the key, the current key will become invalid, potentially
            disrupting services using it. Be sure to update all your
            applications with the new key.
          </p>

          {/* Triggering the AlertDialog */}
          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => setIsModalOpen(true)}
                disabled={isRegenerating}
                className="ml-4"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                {isRegenerating ? "Regenerating..." : "Regenerate Key"}
              </Button>
            </AlertDialogTrigger>

            {/* Alert Dialog Content */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-pretty">
                Are you sure you want to regenerate your API key? Your old key
                will stop working immediately.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerate}>
                  {isRegenerating ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-brand-900 dark:text-brand-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0115.1-4.4L23 4a9.9 9.9 0 00-1.4-1.6C19.6-.9 15.1-2 12-2 5.4-2 1 2.4 1 8s4.4 10 9.9 10c2.7 0 5.2-.8 7.1-2.3l3.1 3.1a8.5 8.5 0 01-2.6 1c-1.5.1-3.1-.5-4.2-1.5-2.2-1.8-3.7-4.6-3.7-7.7z"
                        />
                      </svg>
                      <span>Regenerating...</span>
                    </span>
                  ) : (
                    "Regenerate"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  )
}
