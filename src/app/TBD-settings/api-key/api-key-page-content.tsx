// "use client" directive enables this component to use React hooks and other client-side logic
"use client"

import { Button } from "@/components/ui/button" // Importing Button component for UI interactions
import { Card } from "@/components/ui/card" // Importing Card component for layout
import { Input } from "@/components/ui/input" // Importing Input component for user input
import {
  CheckIcon,
  ClipboardIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2,
} from "lucide-react" // Importing icons for visual feedback
import { useState } from "react" // Importing React’s useState hook for state management
import { Modal } from "@/components/ui/modal" // Importing Modal component for displaying modal dialogs

interface ApiKeyPageContentProps {
  apiKey: string // Prop to accept the initial API key from the parent component
}

export const ApiKeyPageContent = ({
  apiKey: initialApiKey,
}: ApiKeyPageContentProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey) // State to manage the API key
  const [copySuccess, setCopySuccess] = useState(false) // State to track copy success feedback
  const [showKey, setShowKey] = useState(false) // State to toggle API key visibility
  const [showRegenerateModal, setShowRegenerateModal] = useState(false) // State to control regenerate modal visibility
  const [isRegenerating, setIsRegenerating] = useState(false) // State to track regeneration process
  const [apiKeyHint, setApiKeyHint] = useState<string>("") // State to store API key hint
  const [isLoadingHint, setIsLoadingHint] = useState(false) // State to track loading status of API key hint
  const [hintError, setHintError] = useState<string>("") // State to store errors when fetching API key hint

  // Function to copy API key to clipboard and provide visual feedback
  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey) // Copies API key to clipboard
      setCopySuccess(true) // Sets copy success state
      setTimeout(() => setCopySuccess(false), 2000) // Resets copy success state after 2 seconds
    }
  }

  const firstVisit = !!apiKey && apiKey !== "" // Checks if this is the first visit based on API key availability

  // Function to handle regenerate button click
  const handleRegenerate = () => {
    setShowRegenerateModal(true) // Opens regenerate confirmation modal
  }

  // Function to fetch API key hint from the server
  const fetchApiKeyHint = async () => {
    try {
      setIsLoadingHint(true) // Sets loading state to true
      setHintError("") // Resets any previous errors

      const response = await fetch("/api/api-key-hint") // Makes API request for hint
      const data = await response.json() // Parses JSON response

      if (data.error) {
        throw new Error(data.error) // Throws error if API responds with an error
      }

      setApiKeyHint(`****${data.apiKeyHint}`) // Updates API key hint with masked value
      setShowKey(true) // Shows the hint in the UI
    } catch (error) {
      console.error("Error fetching API key hint:", error) // Logs error to console
      setHintError(
        error instanceof Error ? error.message : "Failed to load API key hint" // Displays appropriate error message
      )
      setShowKey(false) // Ensures key hint is hidden if there’s an error
    } finally {
      setIsLoadingHint(false) // Resets loading state
    }
  }

  // Function to confirm regeneration of the API key
  const confirmRegenerate = async () => {
    try {
      setIsRegenerating(true) // Sets regenerating state to true
      const response = await fetch("/api/regenerate-key", {
        method: "POST", // Sends POST request to regenerate endpoint
      })
      const data = await response.json() // Parses JSON response

      if (data.error) {
        throw new Error(data.error) // Throws error if API responds with an error
      }

      setApiKey(data.apiKey) // Updates API key with the newly generated one
      setShowRegenerateModal(false) // Closes the regenerate modal
    } catch (error) {
      console.error("Error regenerating key:", error) // Logs error to console
      // Optional: Display error message to the user
    } finally {
      setIsRegenerating(false) // Resets regenerating state
    }
  }

  return (
    <Card className="max-w-xl w-full" aria-labelledby="api-key-title">
      {firstVisit && (
        <div className="p-6 space-y-4">
          <h2
            id="api-key-title"
            className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200"
          >
            Your API Key
          </h2>
          <div className="mt-1 relative">
            <Input
              type="text"
              value={apiKey}
              readOnly
              className="pr-20 text-sm text-gray-500 dark:text-gray-400 text-ellipsis overflow-hidden ..."
              aria-label="Your API Key"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Button
                variant="ghost"
                onClick={copyApiKey}
                className="h-8 w-8 p-0"
                title="Copy API key"
                aria-label="Copy API Key"
              >
                {copySuccess ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 text-pretty mt-4">
            <div className="mb-4">
              This is the only time you’ll get to see your API key. Copy it and
              save it in a secure location.{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-100">
                Do not share your API key with anyone
              </span>
              , as it provides full access to your account’s services.
            </div>
            <div>
              If you lose your API key, you’ll need to generate a new one. This
              may disrupt any service or integration currently using the key.
            </div>
          </div>
        </div>
      )}

      {!firstVisit && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <h2
                id="api-key-title"
                className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200"
              >
                Your API Key
              </h2>
              {showKey ? (
                <Button
                  variant="link"
                  className="p-0 h-auto hover:bg-transparent text-gray-600 dark:text-gray-300"
                  onClick={() => setShowKey(false)}
                  aria-label="Hide API Key"
                >
                  <EyeOffIcon className="size-4 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {apiKeyHint || "No hint available"}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="text-sm p-0 h-auto flex items-center space-x-2 text-gray-300 dark:text-gray-300"
                  onClick={fetchApiKeyHint}
                  disabled={isLoadingHint}
                  aria-label="Reveal API Key hint"
                >
                  <EyeIcon className="size-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300 flex items-center">
                    {isLoadingHint ? (
                      <>
                        Retrieving
                        <Loader2
                          className="animate-spin ml-2 size-4 text-gray-600 dark:text-gray-300"
                          size="sm"
                          aria-label="Loading"
                        />
                      </>
                    ) : (
                      "Reveal API Key hint"
                    )}
                  </span>
                </Button>
              )}
            </div>
            <Button
              size="sm"
              className="ml-auto"
              onClick={handleRegenerate}
              aria-label="Regenerate API Key"
            >
              Regenerate
            </Button>
          </div>
          {hintError && <p className="text-sm text-red-500">{hintError}</p>}
          <p className="text-sm text-gray-600 dark:text-gray-300 text-pretty">
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
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="space-y-6">
          <div>
            <h2
              id="modal-title"
              className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200"
            >
              Regenerate
            </h2>
            <div
              id="modal-description"
              className="text-sm/6 text-gray-600 dark:text-gray-300"
            >
              <p>
                Are you sure you want to regenerate? If you regenerate, you
                might need to update your code for your app to work properly.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-brand-900">
            <Button
              variant="outline"
              onClick={() => setShowRegenerateModal(false)}
              disabled={isRegenerating}
              aria-label="Cancel Regeneration"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRegenerate}
              disabled={isRegenerating}
              aria-label="Confirm Regeneration"
            >
              {isRegenerating ? (
                <>
                  Regenerating
                  <Loader2 className="size-4 ml-2 animate-spin" />
                </>
              ) : (
                "Yes, regenerate"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

export default ApiKeyPageContent
