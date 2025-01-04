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
          <TableRow className="dark:hover:bg-brand-950/40">
            <TableHead>Service</TableHead>
            <TableHead>Enable</TableHead>
            <TableHead>Identifier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:text-gray-300">
          {/* Discord */}
          <TableRow className="dark:hover:bg-brand-950/40">
            <TableCell className="font-medium">Discord</TableCell>
            <TableCell>
              <Switch
                checked={discordEnabled}
                onCheckedChange={setDiscordEnabled}
                className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
              />
            </TableCell>
            <TableCell className="text-right">
              <Input
                className="mt-1"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="Enter your Discord ID"
              />
            </TableCell>
          </TableRow>
          {/* Webex */}
          <TableRow className="dark:hover:bg-brand-950/40">
            <TableCell className="font-medium">Webex</TableCell>
            <TableCell>
              <Switch
                checked={webexEnabled}
                onCheckedChange={setWebexEnabled}
                className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
              />
            </TableCell>
            <TableCell className="text-right">
              <Input
                className="mt-1"
                value={webexId}
                onChange={(e) => setWebexId(e.target.value)}
                placeholder="Enter your Webex ID"
              />
            </TableCell>
          </TableRow>
          {/* Slack */}
          <TableRow className="dark:hover:bg-brand-950/40">
            <TableCell className="font-medium">Slack</TableCell>
            <TableCell>
              <Switch
                checked={slackEnabled}
                onCheckedChange={setSlackEnabled}
                className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
              />
            </TableCell>
            <TableCell className="text-right">
              <Input
                className="mt-1"
                value={slackId}
                onChange={(e) => setSlackId(e.target.value)}
                placeholder="Enter your Slack ID"
              />
            </TableCell>
          </TableRow>
          {/* WhatsApp */}
          <TableRow className="dark:hover:bg-brand-950/40">
            <TableCell className="font-medium">WhatsApp</TableCell>
            <TableCell>
              <Switch
                checked={whatsappEnabled}
                onCheckedChange={setWhatsappEnabled}
                className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
              />
            </TableCell>
            <TableCell className="text-right">
              <Input
                className="mt-1 dark:placeholder:text-gray-600"
                value={whatsappId}
                onChange={(e) => setWhatsappId(e.target.value)}
                placeholder="Enter your WhatsApp ID"
              />
            </TableCell>
          </TableRow>
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
