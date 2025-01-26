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

type ChannelsPageContentProps = {
  activeChannel: ServiceName
  discordId: string
  emailId: string
  webexId: string
  slackId: string
  webexVerified: Date | null
  slackVerified: Date | null
  discordVerified: Date | null
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
  const [isUpdating, setIsUpdating] = useState(false)
  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    EMAIL: initialEmailId,
    WEBEX: initialWebexId,
    SLACK: initialSlackId,
  })

  const { data: session } = useSession()
  const verification = useChannelVerification()

  const handleInputChange = async (
    serviceName: Exclude<ServiceName, "NONE">,
    value: string
  ) => {
    // Update local state immediately
    setChannelIds((prev) => ({
      ...prev,
      [serviceName]: value,
    }))

    // Reset verification status when ID changes
    if (serviceName === "DISCORD") {
      setDiscordVerified(null)
    } else if (serviceName === "WEBEX") {
      setWebexVerified(null)
    } else if (serviceName === "SLACK") {
      setSlackVerified(null)
    }

    if (!value.trim()) {
      try {
        const response = await fetch("/api/user/channel-id", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceName }),
        })

        if (!response.ok) {
          throw new Error("Failed to delete channel ID")
        }

        // If this was the active channel, reset local state
        if (activeChannel === serviceName) {
          setActiveChannel("NONE")
        }
      } catch (error) {
        console.error("Failed to delete channel ID:", error)
        setChannelIds((prev) => ({
          ...prev,
          [serviceName]: value,
        }))
      }
    } else {
      try {
        const response = await fetch("/api/user/channel-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceName, value }),
        })

        if (!response.ok) {
          throw new Error("Failed to update channel ID")
        }
      } catch (error) {
        console.error("Failed to update channel ID:", error)
        setChannelIds((prev) => ({
          ...prev,
          [serviceName]: value,
        }))
      }
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

  const MAX_LENGTHS = {
    DISCORD: 20,
    EMAIL: 254,
    WEBEX: 100,
    SLACK: 20,
  } as const

  const handleVerify = async (serviceName: Exclude<ServiceName, "NONE">) => {
    if (!session?.user?.id) return

    // First show modal and set service
    verification.setCurrentVerifyingService(serviceName)
    verification.setShowVerificationModal(true)

    // Then send initial verification code
    verification.verificationMutation.mutate(
      {
        serviceName,
        serviceId: channelIds[serviceName],
        userId: session.user.id,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            // Only update verification status and close modal when verifying code
            if (verification.verificationStep === "verifying") {
              if (serviceName === "DISCORD") {
                setDiscordVerified(new Date())
              } else if (serviceName === "WEBEX") {
                setWebexVerified(new Date())
              } else if (serviceName === "SLACK") {
                setSlackVerified(new Date())
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
          const currentId = channelIds[name as keyof ChannelIds]
          const hasValidId = currentId?.trim().length > 0

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
              }
              isActive={activeChannel === name}
              isUpdating={isUpdating}
              isPendingVerification={
                verification.verificationMutation.isPending
              }
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

      {/* Instructions */}
      {activeChannel !== "NONE" && (
        <InstructionsBox
          channel={
            activeChannel.toLowerCase() as Lowercase<
              Exclude<ServiceName, "NONE">
            >
          }
        />
      )}

      {/* Verification Modal */}
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
                  // Update verification status
                  if (verification.currentVerifyingService === "DISCORD") {
                    setDiscordVerified(new Date())
                  } else if (verification.currentVerifyingService === "WEBEX") {
                    setWebexVerified(new Date())
                  } else if (verification.currentVerifyingService === "SLACK") {
                    setSlackVerified(new Date())
                  }
                  // Close modal
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
