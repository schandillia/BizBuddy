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

type ServiceName = "DISCORD" | "WEBEX" | "WHATSAPP" | "SLACK" | "TEAMS" | "NONE"

type IntegrationIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

type IntegrationPageContentProps = {
  activeIntegration: ServiceName
  discordId: string
  webexId: string
  whatsappId: string
  slackId: string
  teamsId: string
}

export const IntegrationPageContent = ({
  activeIntegration: initialActiveIntegration,
  discordId: initialDiscordId,
  webexId: initialWebexId,
  whatsappId: initialWhatsappId,
  slackId: initialSlackId,
  teamsId: initialTeamsId,
}: IntegrationPageContentProps) => {
  const [activeIntegration, setActiveIntegration] = useState<ServiceName>(
    initialActiveIntegration
  )
  const [integrationIds, setIntegrationIds] = useState<IntegrationIds>({
    DISCORD: initialDiscordId,
    WEBEX: initialWebexId,
    WHATSAPP: initialWhatsappId,
    SLACK: initialSlackId,
    TEAMS: initialTeamsId,
  })

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
      const res = await client.project.setIntegration.$post({
        activeIntegration,
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
    setIntegrationIds((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
  }

  const handleServiceToggle = (serviceName: Exclude<ServiceName, "NONE">) => {
    if (integrationIds[serviceName]?.trim()) {
      setActiveIntegration((prev) =>
        prev === serviceName ? "NONE" : serviceName
      )
    }
  }

  const handleSave = () => {
    if (activeIntegration === "NONE") {
      return
    }

    const currentId =
      integrationIds[activeIntegration as Exclude<ServiceName, "NONE">]
    if (!currentId?.trim()) {
      return
    }

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
            const currentId = integrationIds[name as keyof IntegrationIds] // Cast here to narrow the type
            const hasValidId = currentId?.trim().length > 0

            return (
              <TableRow key={name} className="dark:hover:bg-brand-950/40">
                <TableCell className="font-medium">{displayName}</TableCell>
                <TableCell>
                  {hasValidId && (
                    <Switch
                      checked={activeIntegration === name}
                      onCheckedChange={() =>
                        handleServiceToggle(
                          name as Exclude<ServiceName, "NONE">
                        )
                      } // Cast here too
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
                    } // Cast here
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
