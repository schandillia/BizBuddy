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
import DiscordInstructions from "@/app/settings/channels/instructions/discord"
import SlackInstructions from "@/app/settings/channels/instructions/slack"
import InstructionsBox from "./instructions/instructions-box"

type ServiceName = "DISCORD" | "WEBEX" | "WHATSAPP" | "SLACK" | "TEAMS" | "NONE"

type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

type ChannelsPageContentProps = {
  activeChannel: ServiceName
  discordId: string
  webexId: string
  whatsappId: string
  slackId: string
  teamsId: string
}

export const ChannelsPageContent = ({
  activeChannel: initialActiveChannel,
  discordId: initialDiscordId,
  webexId: initialWebexId,
  whatsappId: initialWhatsappId,
  slackId: initialSlackId,
  teamsId: initialTeamsId,
}: ChannelsPageContentProps) => {
  const [activeChannel, setActiveChannel] =
    useState<ServiceName>(initialActiveChannel)

  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    WEBEX: initialWebexId,
    WHATSAPP: initialWhatsappId,
    SLACK: initialSlackId,
    TEAMS: initialTeamsId,
  })

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
      const res = await client.project.setChannel.$post({
        activeChannel,
        discordId,
        webexId,
        whatsappId,
        slackId,
        teamsId,
      })
      return await res.json()
    },
  })

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

  const handleInputChange = (
    serviceName: Exclude<ServiceName, "NONE">,
    value: string
  ) => {
    setChannelIds((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
  }

  const handleServiceToggle = (serviceName: Exclude<ServiceName, "NONE">) => {
    if (channelIds[serviceName]?.trim()) {
      setActiveChannel((prev) => (prev === serviceName ? "NONE" : serviceName))
    }
  }

  const handleSave = () => {
    if (activeChannel === "NONE") {
      return
    }

    const currentId = channelIds[activeChannel as Exclude<ServiceName, "NONE">]
    if (!currentId?.trim()) {
      return
    }

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
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Identifier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:text-gray-300">
          {serviceConfigs.map(({ name, displayName, placeholder }) => {
            const currentId = channelIds[name as keyof ChannelIds]
            const hasValidId = currentId?.trim().length > 0

            return (
              <TableRow key={name} className="dark:hover:bg-brand-950/40">
                <TableCell className="font-medium">{displayName}</TableCell>
                <TableCell>
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
        <Button
          onClick={handleSave}
          disabled={
            isPending ||
            activeChannel === "NONE" ||
            !channelIds[activeChannel as Exclude<ServiceName, "NONE">]?.trim()
          }
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {/* Render instructions for active service */}
      {activeChannel === "DISCORD" && <InstructionsBox channel="discord" />}
      {activeChannel === "SLACK" && <InstructionsBox channel="slack" />}
    </div>
  )
}
