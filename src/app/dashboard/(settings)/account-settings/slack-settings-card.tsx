"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

export const SlackSettingsCard = ({
  slackId: initialSlackId,
}: {
  slackId: string
}) => {
  const [slackId, setSlackId] = useState(initialSlackId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (slackId: string) => {
      const res = await client.project.setSlackID.$post({ slackId })
      return await res.json()
    },
  })

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label className="dark:text-gray-400">Slack ID</Label>
        <Input
          className="mt-1"
          value={slackId}
          onChange={(e) => setSlackId(e.target.value)}
          placeholder="Enter your Slack ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-300">
        Don’t know how to find your Slack ID?{" "}
        <Link href="#" className="text-brand-600 hover:text-brand-500">
          Learn how to obtain one here
        </Link>
        .
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(slackId)} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}
