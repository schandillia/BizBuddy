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

// Define the allowed service names for channels.
type ServiceName = "DISCORD" | "WEBEX" | "WHATSAPP" | "SLACK" | "TEAMS" | "NONE"

// Define the shape of the channel IDs (mapping each service to its ID).
type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

// Define the props expected by the ChannelsPageContent component.
type ChannelsPageContentProps = {
  activeChannel: ServiceName // The currently active channel service
  discordId: string // Discord service ID
  webexId: string // Webex service ID
  whatsappId: string // WhatsApp service ID
  slackId: string // Slack service ID
  teamsId: string // Teams service ID
}

export const ChannelsPageContent = ({
  activeChannel: initialActiveChannel,
  discordId: initialDiscordId,
  webexId: initialWebexId,
  whatsappId: initialWhatsappId,
  slackId: initialSlackId,
  teamsId: initialTeamsId,
}: ChannelsPageContentProps) => {
  // State to track the active channel service
  const [activeChannel, setActiveChannel] =
    useState<ServiceName>(initialActiveChannel)

  // State to track the channel IDs for each service
  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    WEBEX: initialWebexId,
    WHATSAPP: initialWhatsappId,
    SLACK: initialSlackId,
    TEAMS: initialTeamsId,
  })

  // Mutation hook for handling saving of the channel data
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      activeChannel,
      discordId,
      webexId,
      whatsappId,
      slackId,
      teamsId,
    }: {
      activeChannel: ServiceName
      discordId?: string
      webexId?: string
      whatsappId?: string
      slackId?: string
      teamsId?: string
    }) => {
      // API call to save the channel data
      const res = await client.project.setChannel.$post({
        activeChannel,
        discordId,
        webexId,
        whatsappId,
        slackId,
        teamsId,
      })
      return await res.json() // Return the response data
    },
  })

  // Configuration for each service channel
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

  // Function to handle changes in input fields for each channel ID
  const handleInputChange = (
    serviceName: Exclude<ServiceName, "NONE">, // Service name (without "NONE")
    value: string // New ID value
  ) => {
    // Update the state with the new ID for the specified service
    setChannelIds((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
  }

  // Function to toggle the active channel service when the switch is clicked
  const handleServiceToggle = (serviceName: Exclude<ServiceName, "NONE">) => {
    // If the service ID is not empty, toggle the active channel
    if (channelIds[serviceName]?.trim()) {
      setActiveChannel((prev) => (prev === serviceName ? "NONE" : serviceName))
    }
  }

  // Function to save the current channel settings
  const handleSave = () => {
    // If no service is active, don't proceed
    if (activeChannel === "NONE") {
      return
    }

    // Get the ID of the active service
    const currentId = channelIds[activeChannel as Exclude<ServiceName, "NONE">]
    // If the ID is empty, don't proceed
    if (!currentId?.trim()) {
      return
    }

    // Trigger the mutation to save the channel data
    mutate({
      activeChannel,
      discordId: channelIds.DISCORD?.trim(),
      webexId: channelIds.WEBEX?.trim(),
      whatsappId: channelIds.WHATSAPP?.trim(),
      slackId: channelIds.SLACK?.trim(),
      teamsId: channelIds.TEAMS?.trim(),
    })
  }

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      {/* Table to display channel services */}
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
            const currentId = channelIds[name as keyof ChannelIds]
            // Check if the ID is valid (non-empty)
            const hasValidId = currentId?.trim().length > 0

            return (
              <TableRow key={name} className="dark:hover:bg-brand-950/40">
                <TableCell className="font-medium">{displayName}</TableCell>
                <TableCell>
                  {/* Display the toggle switch if the service ID is valid */}
                  {hasValidId && (
                    <Switch
                      checked={activeChannel === name}
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
            activeChannel === "NONE" ||
            !channelIds[activeChannel as Exclude<ServiceName, "NONE">]?.trim()
          }
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
