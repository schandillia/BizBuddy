// app/settings/api-key/api-key-wrapper.tsx
"use client"

import { ApiKeyPageContent } from "./api-key-page-content"
import { useState } from "react"

interface ApiKeyWrapperProps {
  initialApiKey: string
}

export const ApiKeyWrapper = ({ initialApiKey }: ApiKeyWrapperProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey)

  const handleRegenerateKey = async () => {
    try {
      const response = await fetch("/api/regenerate-key", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate key")
      }

      const { apiKey: newApiKey } = await response.json()
      setApiKey(newApiKey) // This will update the UI immediately
    } catch (error) {
      console.error("Error regenerating key:", error)
      // You might want to show an error toast here
    }
  }

  return (
    <ApiKeyPageContent apiKey={apiKey} onRegenerateKey={handleRegenerateKey} />
  )
}
