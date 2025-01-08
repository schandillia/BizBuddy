"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Modal } from "@/components/ui/modal"

interface ApiKeyPageContentProps {
  apiKey: string
}

export const ApiKeyPageContent = ({
  apiKey: initialApiKey,
}: ApiKeyPageContentProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const firstVisit = !apiKey.startsWith("****")

  const handleRegenerate = () => {
    setShowRegenerateModal(true)
  }

  const confirmRegenerate = async () => {
    try {
      setIsRegenerating(true)
      const response = await fetch("/api/regenerate-key", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate key")
      }

      const { apiKey: newApiKey } = await response.json()
      setApiKey(newApiKey)
      setShowRegenerateModal(false)
    } catch (error) {
      console.error("Error regenerating key:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <Card className="max-w-xl w-full">
      {firstVisit && (
        <div className="p-6 space-y-4">
          <div>
            <Label className="dark:text-gray-400">Your API Key</Label>
            <div className="mt-1 relative">
              <Input type="text" value={apiKey} readOnly className="pr-14" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Button
                  variant="ghost"
                  onClick={copyApiKey}
                  className="h-8 w-8 p-0"
                  title="Copy API key"
                >
                  {copySuccess ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-200 text-pretty mt-4">
              <div className="mb-4">
                This is the only time you'll be able to view your API key in its
                plain text format. Please copy it and store it securely, as you
                won't be able to access it again.{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-100">
                  Do not share your API key with anyone
                </span>
                , as it provides full access to your account's services.
              </div>
              <div>
                If you lose your API key, you'll need to regenerate a new one.
                This may disrupt any services or integrations currently using
                the key.
              </div>
            </div>
          </div>
        </div>
      )}

      {!firstVisit && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            {showKey ? (
              <>
                <Button
                  variant="link"
                  className="p-0 h-auto hover:bg-transparent text-gray-500 dark:text-gray-400"
                  onClick={() => setShowKey(false)}
                >
                  <EyeOffIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {apiKey}
                </span>
              </>
            ) : (
              <>
                <Button
                  variant="link"
                  className="text-sm p-0 h-auto flex items-center space-x-2 dark:text-gray-400"
                  onClick={() => setShowKey(true)}
                >
                  <EyeIcon className="size-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Reveal API Key hint
                  </span>
                </Button>
              </>
            )}
            <Button size="sm" className="ml-auto" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-pretty">
            Your API key is sensitive and provides access to your service. Treat
            it like a password—do not share it or expose it publicly. If you
            regenerate the key, the current key will become invalid, potentially
            disrupting services using it.
          </p>
        </div>
      )}

      <Modal
        className="max-w-xl p-8"
        showModal={showRegenerateModal}
        setShowModal={setShowRegenerateModal}
      >
        <div className="space-y-6">
          <h2 className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200">
            Regenerate
          </h2>
          <div className="space-y-2 text-sm/6 text-gray-600 dark:text-gray-300">
            <p>Are you sure you want to regenerate?</p>
            <p>
              If you regenerate, you might need to update your code for your app
              to work properly.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowRegenerateModal(false)}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? "Regenerating..." : "Yes, regenerate"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

export default ApiKeyPageContent
