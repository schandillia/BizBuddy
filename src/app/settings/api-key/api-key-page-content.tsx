import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckIcon, ClipboardIcon, RefreshCwIcon } from "lucide-react"
import { useState, useEffect } from "react"
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
  const [showNewKeyWarning, setShowNewKeyWarning] = useState(false)

  const isEncrypted = apiKey?.startsWith("$")

  // Show warning when a new unencrypted key is generated
  useEffect(() => {
    if (apiKey && !isEncrypted) {
      setShowNewKeyWarning(true)
    }
  }, [apiKey, isEncrypted])

  const copyApiKey = () => {
    if (apiKey && !isEncrypted) {
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
      setIsModalOpen(false)
    }
  }

  return (
    <Card className="max-w-xl w-full">
      <div className="p-6 space-y-4">
        {showNewKeyWarning && !isEncrypted && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="text-xs text-pretty text-red-500 dark:text-red-400">
              This is the only time you’ll see this API key in plain text.
              Please copy it now and store it securely. If you lose it, you’ll
              need to generate a new key.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label className="dark:text-gray-400">Your API Key</Label>
          <div className="mt-1 relative">
            <Input
              type={isEncrypted ? "password" : "text"}
              value={apiKey || "Generating..."}
              readOnly
              disabled={isEncrypted}
              className={`pr-14 ${!apiKey ? "italic text-gray-500" : ""} 
                ${
                  isEncrypted
                    ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    : ""
                }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Button
                variant="ghost"
                onClick={copyApiKey}
                className="h-8 w-8 p-0"
                disabled={!apiKey || isEncrypted}
                title={
                  isEncrypted
                    ? "Encrypted keys cannot be copied"
                    : "Copy API key"
                }
              >
                {copySuccess ? (
                  <CheckIcon className="h-4 w-4 text-brand-900 dark:text-brand-700" />
                ) : (
                  <ClipboardIcon className="h-4 w-4 text-brand-900 dark:text-brand-700" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 text-pretty pr-4 border-r-2 border-black/10 dark:border-black/20">
            {isEncrypted
              ? "This API key is encrypted and can’t be viewed in plain text. If you need to see the key again, you'll need to regenerate it."
              : "Your API key is sensitive and provides access to your account. Treat it like a password—do not share it or expose it publicly. If you regenerate the key, the current key will become invalid, potentially disrupting services using it."}
          </p>

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

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-pretty">
                Are you sure you want to regenerate your API key? Your old key
                will stop working immediately. Remember to copy the new key
                immediately as you won't be able to see it again after it's
                encrypted.
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
