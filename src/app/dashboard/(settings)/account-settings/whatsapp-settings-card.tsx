"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

export const WhatsappSettingsCard = ({
  whatsappId: initialWhatsappId,
}: {
  whatsappId: string
}) => {
  const [whatsappId, setWhatsappId] = useState(initialWhatsappId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (whatsappId: string) => {
      const res = await client.project.setWhatsappID.$post({ whatsappId })
      return await res.json()
    },
  })

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label className="dark:text-gray-400">Whatsapp ID</Label>
        <Input
          className="mt-1"
          value={whatsappId}
          onChange={(e) => setWhatsappId(e.target.value)}
          placeholder="Enter your Whatsapp ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-300">
        Don’t know how to find your Whatsapp ID?{" "}
        <Link href="#" className="text-brand-600 hover:text-brand-500">
          Learn how to obtain one here
        </Link>
        .
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(whatsappId)} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}
