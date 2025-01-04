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

type IntegrationService = {
  name: string
  id: string
  setId: (value: string) => void
  enabled: boolean
  setEnabled: (value: boolean) => void
  placeholder: string
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
  const [discordId, setDiscordId] = useState(initialDiscordId)
  const [webexId, setWebexId] = useState(initialWebexId)
  const [slackId, setSlackId] = useState(initialSlackId)
  const [whatsappId, setWhatsappId] = useState(initialWhatsappId)

  const [discordEnabled, setDiscordEnabled] = useState(initialDiscordEnabled)
  const [webexEnabled, setWebexEnabled] = useState(initialWebexEnabled)
  const [whatsappEnabled, setWhatsappEnabled] = useState(initialWhatsappEnabled)
  const [slackEnabled, setSlackEnabled] = useState(initialSlackEnabled)

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IntegrationPageContentProps) => {
      const res = await client.project.setIntegrationIDs.$post(data)
      return await res.json()
    },
  })

  const integrationServices: IntegrationService[] = [
    {
      name: "Discord",
      id: discordId,
      setId: setDiscordId,
      enabled: discordEnabled,
      setEnabled: setDiscordEnabled,
      placeholder: "Enter your Discord ID",
    },
    {
      name: "Webex",
      id: webexId,
      setId: setWebexId,
      enabled: webexEnabled,
      setEnabled: setWebexEnabled,
      placeholder: "Enter your Webex ID",
    },
    {
      name: "Slack",
      id: slackId,
      setId: setSlackId,
      enabled: slackEnabled,
      setEnabled: setSlackEnabled,
      placeholder: "Enter your Slack ID",
    },
    {
      name: "WhatsApp",
      id: whatsappId,
      setId: setWhatsappId,
      enabled: whatsappEnabled,
      setEnabled: setWhatsappEnabled,
      placeholder: "Enter your WhatsApp ID",
    },
  ]

  const handleSave = () => {
    mutate({
      discordId,
      webexId,
      slackId,
      whatsappId,
      discordEnabled,
      webexEnabled,
      whatsappEnabled,
      slackEnabled,
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
          {integrationServices.map((service) => (
            <TableRow key={service.name} className="dark:hover:bg-brand-950/40">
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Switch
                  checked={service.enabled}
                  onCheckedChange={service.setEnabled}
                  className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  className="mt-1 dark:placeholder:text-gray-600"
                  value={service.id}
                  onChange={(e) => service.setId(e.target.value)}
                  placeholder={service.placeholder}
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
