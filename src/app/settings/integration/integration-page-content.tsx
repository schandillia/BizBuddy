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

type ServiceName = "discord" | "webex" | "slack" | "whatsapp"

type ServiceState = {
  id: string
  enabled: boolean
}

type IntegrationPageContentProps = {
  discordId: string
  webexId: string
  slackId: string
  whatsappId: string
  discordEnabled: boolean
  webexEnabled: boolean
  whatsappEnabled: boolean
  slackEnabled: boolean
}

export const IntegrationPageContent = ({
  discordId: initialDiscordId,
  webexId: initialWebexId,
  slackId: initialSlackId,
  whatsappId: initialWhatsappId,
  discordEnabled: initialDiscordEnabled,
  webexEnabled: initialWebexEnabled,
  whatsappEnabled: initialWhatsappEnabled,
  slackEnabled: initialSlackEnabled,
}: IntegrationPageContentProps) => {
  const [services, setServices] = useState<Record<ServiceName, ServiceState>>({
    discord: { id: initialDiscordId, enabled: initialDiscordEnabled },
    webex: { id: initialWebexId, enabled: initialWebexEnabled },
    slack: { id: initialSlackId, enabled: initialSlackEnabled },
    whatsapp: { id: initialWhatsappId, enabled: initialWhatsappEnabled },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IntegrationPageContentProps) => {
      const res = await client.project.setIntegrationIDs.$post(data)
      return await res.json()
    },
  })

  const updateService = (
    serviceName: ServiceName,
    updates: Partial<ServiceState>
  ) => {
    setServices((prev) => {
      // If we're enabling a service, disable all others
      if (updates.enabled) {
        const newServices = Object.keys(prev).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              ...prev[key as ServiceName],
              enabled: false, // Disable all services initially
            },
          }),
          {} as Record<ServiceName, ServiceState>
        )

        // Then enable only the selected service
        return {
          ...newServices,
          [serviceName]: {
            ...prev[serviceName],
            ...updates,
          },
        }
      }

      // If we're just updating the ID or disabling a service, proceed normally
      return {
        ...prev,
        [serviceName]: {
          ...prev[serviceName],
          ...updates,
        },
      }
    })
  }

  const serviceConfigs = [
    {
      name: "discord" as ServiceName,
      displayName: "Discord",
      placeholder: "Enter your Discord ID",
    },
    {
      name: "webex" as ServiceName,
      displayName: "Webex",
      placeholder: "Enter your Webex ID",
    },
    {
      name: "slack" as ServiceName,
      displayName: "Slack",
      placeholder: "Enter your Slack ID",
    },
    {
      name: "whatsapp" as ServiceName,
      displayName: "WhatsApp",
      placeholder: "Enter your WhatsApp ID",
    },
  ]

  const handleSave = () => {
    const payload = {
      discordId: services.discord.id,
      webexId: services.webex.id,
      slackId: services.slack.id,
      whatsappId: services.whatsapp.id,
      discordEnabled:
        services.discord.id.trim() !== "" && services.discord.enabled,
      webexEnabled: services.webex.id.trim() !== "" && services.webex.enabled,
      slackEnabled: services.slack.id.trim() !== "" && services.slack.enabled,
      whatsappEnabled:
        services.whatsapp.id.trim() !== "" && services.whatsapp.enabled,
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
          {serviceConfigs.map(({ name, displayName, placeholder }) => (
            <TableRow key={name} className="dark:hover:bg-brand-950/40">
              <TableCell className="font-medium">{displayName}</TableCell>
              <TableCell>
                {services[name].id.trim() !== "" && (
                  <Switch
                    checked={services[name].enabled}
                    onCheckedChange={(value) =>
                      updateService(name, { enabled: value })
                    }
                    className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                <Input
                  className="mt-1 dark:placeholder:text-gray-600"
                  value={services[name].id}
                  onChange={(e) => updateService(name, { id: e.target.value })}
                  placeholder={placeholder}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pt-4">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
