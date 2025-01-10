"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useState } from "react"

// Define the user type
interface User {
  id: string
  id: string | null
  quotaLimit: number
  plan: string // Replace with your Plan type if available
  theme: string // Replace with your Theme type if available
  email: string
  apiKey: string
  activeChannel: string
  discordId: string | null
  webexId: string | null
  slackId: string | null
  teamsId: string | null
  createdAt: Date
  updatedAt: Date
}

export const ProfilePageContent = ({ user }: { user: User }) => {
  return (
    <>
      <h2>Profile</h2>
      <p>{user.email}</p>
    </>
  )
}
