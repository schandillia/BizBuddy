"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// Define the allowed service names for integrations.
type ServiceName = "DISCORD" | "WEBEX" | "WHATSAPP" | "SLACK" | "TEAMS" | "NONE"

// Define the shape of the integration IDs (mapping each service to its ID).
type IntegrationIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

// Define the props expected by the IntegrationPageContent component.
type IntegrationPageContentProps = {
  activeIntegration: ServiceName // The currently active integration service
  discordId: string // Discord service ID
  webexId: string // Webex service ID
  whatsappId: string // WhatsApp service ID
  slackId: string // Slack service ID
  teamsId: string // Teams service ID
}

export const IntegrationPageContent = ({
  activeIntegration: initialActiveIntegration,
  discordId: initialDiscordId,
  webexId: initialWebexId,
  whatsappId: initialWhatsappId,
  slackId: initialSlackId,
  teamsId: initialTeamsId,
}: IntegrationPageContentProps) => {
  // State to track the active integration service
  const [activeIntegration, setActiveIntegration] = useState<ServiceName>(
    initialActiveIntegration
  )

  // State to track the integration IDs for each service
  const [integrationIds, setIntegrationIds] = useState<IntegrationIds>({
    DISCORD: initialDiscordId,
    WEBEX: initialWebexId,
    WHATSAPP: initialWhatsappId,
    SLACK: initialSlackId,
    TEAMS: initialTeamsId,
  })

  // Mutation hook for handling saving of the integration data
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      activeIntegration,
      discordId,
      webexId,
      whatsappId,
      slackId,
      teamsId,
    }: {
      activeIntegration: ServiceName
      discordId?: string
      webexId?: string
      whatsappId?: string
      slackId?: string
      teamsId?: string
    }) => {
      // API call to save the integration data
      const res = await client.project.setIntegration.$post({
        activeIntegration,
        discordId,
        webexId,
        whatsappId,
        slackId,
        teamsId,
      })
      return await res.json() // Return the response data
    },
  })

  // Configuration for each service integration
  const serviceConfigs = [
    {
      name: "DISCORD",
      displayName: "Discord",
      placeholder: "Enter your Discord ID",
    },
    { name: "WEBEX", displayName: "Webex", placeholder: "Enter your Webex ID" },
    { name: "SLACK", displayName: "Slack", placeholder: "Enter your Slack ID" },
    {
      name: "WHATSAPP",
      displayName: "WhatsApp",
      placeholder: "Enter your WhatsApp ID",
    },
    { name: "TEAMS", displayName: "Teams", placeholder: "Enter your Teams ID" },
  ]

  // Function to handle changes in input fields for each integration ID
  const handleInputChange = (
    serviceName: Exclude<ServiceName, "NONE">, // Service name (without "NONE")
    value: string // New ID value
  ) => {
    // Update the state with the new ID for the specified service
    setIntegrationIds((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
  }

  // Function to toggle the active integration service when the switch is clicked
  const handleServiceToggle = (serviceName: Exclude<ServiceName, "NONE">) => {
    // If the service ID is not empty, toggle the active integration
    if (integrationIds[serviceName]?.trim()) {
      setActiveIntegration((prev) =>
        prev === serviceName ? "NONE" : serviceName
      )
    }
  }

  // Function to save the current integration settings
  const handleSave = () => {
    // If no service is active, don't proceed
    if (activeIntegration === "NONE") {
      return
    }

    // Get the ID of the active service
    const currentId =
      integrationIds[activeIntegration as Exclude<ServiceName, "NONE">]
    // If the ID is empty, don't proceed
    if (!currentId?.trim()) {
      return
    }

    // Trigger the mutation to save the integration data
    mutate({
      activeIntegration,
      discordId: integrationIds.DISCORD?.trim(),
      webexId: integrationIds.WEBEX?.trim(),
      whatsappId: integrationIds.WHATSAPP?.trim(),
      slackId: integrationIds.SLACK?.trim(),
      teamsId: integrationIds.TEAMS?.trim(),
    })
  }

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      {/* Table to display integration services */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Identifier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:text-gray-300">
          {/* Iterate through each service and render a table row */}
          {serviceConfigs.map(({ name, displayName, placeholder }) => {
            // Get the current ID for the service
            const currentId = integrationIds[name as keyof IntegrationIds]
            // Check if the ID is valid (non-empty)
            const hasValidId = currentId?.trim().length > 0

            return (
              <TableRow key={name} className="dark:hover:bg-brand-950/40">
                <TableCell className="font-medium">{displayName}</TableCell>
                <TableCell>
                  {/* Display the toggle switch if the service ID is valid */}
                  {hasValidId && (
                    <Switch
                      checked={activeIntegration === name}
                      onCheckedChange={() =>
                        handleServiceToggle(
                          name as Exclude<ServiceName, "NONE">
                        )
                      }
                      className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* Input field for entering the service ID */}
                  <Input
                    className="mt-1 dark:placeholder:text-gray-600"
                    value={currentId}
                    onChange={(e) =>
                      handleInputChange(
                        name as Exclude<ServiceName, "NONE">,
                        e.target.value
                      )
                    }
                    placeholder={placeholder}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="pt-4">
        {/* Button to save the changes */}
        <Button
          onClick={handleSave}
          disabled={
            // Disable button if conditions are not met
            isPending ||
            activeIntegration === "NONE" ||
            !integrationIds[
              activeIntegration as Exclude<ServiceName, "NONE">
            ]?.trim()
          }
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
