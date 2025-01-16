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
import InstructionsBox from "./instructions/instructions-box"
import { Loader2 } from "lucide-react"

type ServiceName =
  | "DISCORD"
  | "EMAIL"
  | "WEBEX"
  | "WHATSAPP"
  | "SLACK"
  | "TEAMS"
  | "NONE"

type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

type ChannelsPageContentProps = {
  activeChannel: ServiceName
  discordId: string
  emailId: string
  webexId: string
  whatsappId: string
  slackId: string
  teamsId: string
}

export const ChannelsPageContent = ({
  activeChannel: initialActiveChannel,
  discordId: initialDiscordId,
  emailId: initialEmailId,
  webexId: initialWebexId,
  whatsappId: initialWhatsappId,
  slackId: initialSlackId,
  teamsId: initialTeamsId,
}: ChannelsPageContentProps) => {
  const [activeChannel, setActiveChannel] =
    useState<ServiceName>(initialActiveChannel)

  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    EMAIL: initialEmailId,
    WEBEX: initialWebexId,
    WHATSAPP: initialWhatsappId,
    SLACK: initialSlackId,
    TEAMS: initialTeamsId,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      activeChannel,
      discordId,
      emailId,
      webexId,
      whatsappId,
      slackId,
      teamsId,
    }: {
      activeChannel: ServiceName
      discordId?: string
      emailId?: string
      webexId?: string
      whatsappId?: string
      slackId?: string
      teamsId?: string
    }) => {
      const res = await client.project.setChannel.$post({
        activeChannel,
        discordId,
        emailId,
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
    {
      name: "EMAIL",
      displayName: "Email",
      placeholder: "Enter your Email ID",
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

  const MAX_LENGTHS = {
    DISCORD: 20,
    EMAIL: 254,
    WEBEX: 100,
    WHATSAPP: 50,
    SLACK: 20,
    TEAMS: 100,
  } as const

  const handleSave = () => {
    if (activeChannel === "NONE") {
      return
    }

    const payload = {
      activeChannel,
      discordId: channelIds.DISCORD?.trim() || undefined,
      emailId: channelIds.EMAIL?.trim() || undefined,
      webexId: channelIds.WEBEX?.trim() || undefined,
      whatsappId: channelIds.WHATSAPP?.trim() || undefined,
      slackId: channelIds.SLACK?.trim() || undefined,
      teamsId: channelIds.TEAMS?.trim() || undefined,
    }

    // Service-specific length validation
    const hasInvalidLength = Object.entries(channelIds).some(
      ([service, value]) => {
        if (!value?.trim()) return false
        const maxLength = MAX_LENGTHS[service as keyof typeof MAX_LENGTHS]
        return value.trim().length > maxLength
      }
    )

    if (hasInvalidLength) {
      alert("One or more IDs exceed their maximum length")
      return
    }

    mutate(payload)
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
          {isPending ? (
            <>
              Updating channel
              <Loader2 className="size-4 ml-2 animate-spin" />{" "}
              {/* Add the loader here */}
            </>
          ) : (
            "Update channel"
          )}
        </Button>
      </div>
      {/* Render instructions for active service */}
      {activeChannel === "DISCORD" && <InstructionsBox channel="discord" />}
      {activeChannel === "WEBEX" && <InstructionsBox channel="webex" />}
      {activeChannel === "SLACK" && <InstructionsBox channel="slack" />}
      {activeChannel === "WHATSAPP" && <InstructionsBox channel="whatsapp" />}
      {activeChannel === "TEAMS" && <InstructionsBox channel="teams" />}
      {activeChannel === "EMAIL" && <InstructionsBox channel="email" />}
    </div>
  )
}
