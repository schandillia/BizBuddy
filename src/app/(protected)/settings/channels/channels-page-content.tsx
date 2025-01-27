"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { serviceConfigs } from "./config"
import { ChannelsTable } from "./channels-table"
import { ChannelRow } from "./channel-row"
import { VerificationModal } from "./verification-modal"
import { useChannelVerification } from "./use-channel-verification"
import InstructionsBox from "./instructions/instructions-box"
import { type ServiceName, type ChannelIds } from "@/types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ChannelIdSchema } from "@/schemas/channel"
import { z } from "zod"

type ChannelsPageContentProps = {
  activeChannel: ServiceName
  discordId: string
  emailId: string
  webexId: string
  slackId: string
  webexVerified: Date | null
  slackVerified: Date | null
  discordVerified: Date | null
  emailIdVerified: Date | null
}

export function ChannelsPageContent({
  activeChannel: initialActiveChannel,
  discordId: initialDiscordId,
  emailId: initialEmailId,
  webexId: initialWebexId,
  slackId: initialSlackId,
  webexVerified: initialWebexVerified,
  slackVerified: initialSlackVerified,
  discordVerified: initialDiscordVerified,
  emailIdVerified: initialEmailIdVerified,
}: ChannelsPageContentProps) {
  const [activeChannel, setActiveChannel] =
    useState<ServiceName>(initialActiveChannel)
  const [webexVerified, setWebexVerified] = useState<Date | null>(
    initialWebexVerified
  )
  const [slackVerified, setSlackVerified] = useState<Date | null>(
    initialSlackVerified
  )
  const [discordVerified, setDiscordVerified] = useState<Date | null>(
    initialDiscordVerified
  )
  const [emailIdVerified, setEmailIdVerified] = useState<Date | null>(
    initialEmailIdVerified
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    EMAIL: initialEmailId,
    WEBEX: initialWebexId,
    SLACK: initialSlackId,
  })
  const [pendingChanges, setPendingChanges] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    EMAIL: initialEmailId,
    WEBEX: initialWebexId,
    SLACK: initialSlackId,
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const { data: session } = useSession()
  const verification = useChannelVerification()

  const validateChannelId = (
    serviceName: keyof typeof ChannelIdSchema,
    value: string
  ) => {
    if (!value.trim()) return { isValid: true, error: null }

    try {
      ChannelIdSchema[serviceName].parse(value)
      return { isValid: true, error: null }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { isValid: false, error: err.errors[0].message }
      }
      return { isValid: false, error: "Invalid channel ID" }
    }
  }

  const handleInputChange = (
    serviceName: Exclude<ServiceName, "NONE">,
    value: string
  ) => {
    // Clear validation error when input changes
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[serviceName]
      return newErrors
    })

    setPendingChanges((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
    setHasChanges(true)

    // Validate on input change to show/hide verify button immediately
    if (value.trim()) {
      const { isValid, error } = validateChannelId(
        serviceName as keyof typeof ChannelIdSchema,
        value
      )
      if (!isValid && error) {
        setValidationErrors((prev) => ({
          ...prev,
          [serviceName]: error,
        }))
      }
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    setValidationErrors({})

    try {
      // Validate all changed values
      const newValidationErrors: Record<string, string> = {}
      for (const [service, value] of Object.entries(pendingChanges)) {
        if (value !== channelIds[service as keyof ChannelIds] && value.trim()) {
          const { isValid, error } = validateChannelId(
            service as keyof typeof ChannelIdSchema,
            value
          )
          if (!isValid && error) {
            newValidationErrors[service] = error
          }
        }
      }

      if (Object.keys(newValidationErrors).length > 0) {
        setValidationErrors(newValidationErrors)
        setIsUpdating(false)
        return
      }

      // Proceed with updates if validation passed
      for (const [service, value] of Object.entries(pendingChanges)) {
        if (value !== channelIds[service as keyof ChannelIds]) {
          if (!value.trim()) {
            const response = await fetch("/api/user/channel-id", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ serviceName: service }),
            })

            if (!response.ok) {
              throw new Error(`Failed to delete ${service}`)
            }

            // Reset verification status
            switch (service) {
              case "DISCORD":
                setDiscordVerified(null)
                break
              case "WEBEX":
                setWebexVerified(null)
                break
              case "SLACK":
                setSlackVerified(null)
                break
              case "EMAIL":
                setEmailIdVerified(null)
                break
            }

            if (activeChannel === service) {
              setActiveChannel("NONE")
            }
          } else {
            const response = await fetch("/api/user/channel-id", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                serviceName: service,
                value,
              }),
            })

            if (!response.ok) {
              throw new Error(`Failed to update ${service}`)
            }
          }
        }
      }

      setChannelIds(pendingChanges)
      setHasChanges(false)
    } catch (error) {
      console.error("Failed to update channels:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleServiceToggle = async (
    serviceName: Exclude<ServiceName, "NONE">
  ) => {
    if (channelIds[serviceName]?.trim()) {
      try {
        setIsUpdating(true)
        const newActiveChannel =
          activeChannel === serviceName ? "NONE" : serviceName

        const response = await fetch("/api/user/active-channel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activeChannel: newActiveChannel }),
        })

        if (!response.ok) throw new Error("Failed to update active channel")

        setActiveChannel(newActiveChannel)
      } catch (error) {
        console.error("Failed to update active channel:", error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleVerify = async (serviceName: Exclude<ServiceName, "NONE">) => {
    if (!session?.user?.id) return

    const value = pendingChanges[serviceName]
    const { isValid, error } = validateChannelId(
      serviceName as keyof typeof ChannelIdSchema,
      value
    )

    if (!isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [serviceName]: error || "Invalid channel ID",
      }))
      return
    }

    // Update channel ID if changed before verification
    if (pendingChanges[serviceName] !== channelIds[serviceName]) {
      try {
        const response = await fetch("/api/user/channel-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceName,
            value: pendingChanges[serviceName],
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update channel ID")
        }

        setChannelIds((prev) => ({
          ...prev,
          [serviceName]: pendingChanges[serviceName],
        }))
        setHasChanges(false)
      } catch (error) {
        console.error("Failed to update channel ID:", error)
        return
      }
    }

    verification.setCurrentVerifyingService(serviceName)
    verification.setShowVerificationModal(true)

    verification.verificationMutation.mutate(
      {
        serviceName,
        serviceId: pendingChanges[serviceName],
        userId: session.user.id,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            if (verification.verificationStep === "verifying") {
              switch (serviceName) {
                case "DISCORD":
                  setDiscordVerified(new Date())
                  break
                case "WEBEX":
                  setWebexVerified(new Date())
                  break
                case "SLACK":
                  setSlackVerified(new Date())
                  break
                case "EMAIL":
                  setEmailIdVerified(new Date())
                  break
              }
              verification.setShowVerificationModal(false)
            }
          }
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <ChannelsTable>
        {serviceConfigs.map(({ name, displayName, placeholder }) => {
          const currentId = pendingChanges[name as keyof ChannelIds]
          const hasValidId =
            currentId?.trim().length > 0 && !validationErrors[name]
          const error = validationErrors[name]

          return (
            <ChannelRow
              key={name}
              name={name}
              displayName={displayName}
              placeholder={placeholder}
              currentId={currentId}
              hasValidId={hasValidId}
              isVerified={
                name === "DISCORD"
                  ? !!discordVerified
                  : name === "WEBEX"
                  ? !!webexVerified
                  : name === "SLACK"
                  ? !!slackVerified
                  : name === "EMAIL"
                  ? !!emailIdVerified
                  : false
              }
              isActive={activeChannel === name}
              isUpdating={isUpdating}
              isPendingVerification={
                verification.verificationMutation.isPending
              }
              error={error}
              onVerify={() =>
                handleVerify(name as Exclude<ServiceName, "NONE">)
              }
              onToggle={() =>
                handleServiceToggle(name as Exclude<ServiceName, "NONE">)
              }
              onChange={(value) =>
                handleInputChange(name as Exclude<ServiceName, "NONE">, value)
              }
            />
          )
        })}
      </ChannelsTable>

      {hasChanges && (
        <div className="flex justify-center">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || Object.keys(validationErrors).length > 0}
            className="flex items-center space-x-2"
          >
            {isUpdating ? (
              <>
                Updating
                <Loader2 className="size-4 ml-2 animate-spin" />
              </>
            ) : (
              "Update Channels"
            )}
          </Button>
        </div>
      )}

      {activeChannel !== "NONE" && (
        <InstructionsBox
          channel={
            activeChannel.toLowerCase() as Lowercase<
              Exclude<ServiceName, "NONE">
            >
          }
        />
      )}

      <VerificationModal
        showModal={verification.showVerificationModal}
        setShowModal={verification.setShowVerificationModal}
        currentVerifyingService={verification.currentVerifyingService}
        form={verification.form}
        onSubmit={(values) => {
          if (!session?.user?.id) return
          verification.verificationMutation.mutate(
            {
              serviceName: verification.currentVerifyingService!,
              serviceId: channelIds[verification.currentVerifyingService!],
              code: values.code,
              userId: session.user.id,
            },
            {
              onSuccess: (data) => {
                if (data.success) {
                  switch (verification.currentVerifyingService) {
                    case "DISCORD":
                      setDiscordVerified(new Date())
                      break
                    case "WEBEX":
                      setWebexVerified(new Date())
                      break
                    case "SLACK":
                      setSlackVerified(new Date())
                      break
                    case "EMAIL":
                      setEmailIdVerified(new Date())
                      break
                  }
                  verification.setShowVerificationModal(false)
                }
              },
            }
          )
        }}
        error={verification.verificationError}
        isPending={verification.verificationMutation.isPending}
        verificationStep={verification.verificationStep}
      />
    </div>
  )
}
