"use client"

import { ApiKeyPageContent } from "./api-key-page-content"
import { useState, useEffect } from "react"
import { isCuid } from "@/lib/api/is-cuid"

interface ApiKeyWrapperProps {
  initialApiKey: string
}

export const ApiKeyWrapper = ({ initialApiKey }: ApiKeyWrapperProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey) // Keep it as string
  const [isVisible, setIsVisible] = useState(!isCuid(initialApiKey)) // Visibility depends on whether it's a CUID

  const handleRegenerateKey = async () => {
    try {
      const response = await fetch("/api/regenerate-key", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate key")
      }

      const { apiKey: newApiKey } = await response.json()
      setApiKey(newApiKey)
      setIsVisible(true) // Show the new API key
    } catch (error) {
      console.error("Error regenerating key:", error)
    }
  }

  useEffect(() => {
    // Automatically regenerate if the initial API key is a CUID
    if (isCuid(initialApiKey)) {
      handleRegenerateKey()
    }
  }, [initialApiKey])

  return (
    <ApiKeyPageContent
      apiKey={isVisible ? apiKey : "********"} // Mask the key if not visible
      onRegenerateKey={handleRegenerateKey}
    />
  )
}
