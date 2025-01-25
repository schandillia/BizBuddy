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
import { Loader2 } from "lucide-react"
import { MdVerified } from "react-icons/md"
import { sendChannelVerification } from "@/app/actions/send-channel-verification"
import { useForm } from "react-hook-form"
import { Modal } from "@/components/ui/modal"
import { ChannelVerificationForm } from "./channel-verification-form"
import InstructionsBox from "./instructions/instructions-box"
import { useSession } from "next-auth/react"

type ServiceName = "DISCORD" | "EMAIL" | "WEBEX" | "SLACK" | "NONE"

type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

type ChannelsPageContentProps = {
  activeChannel: ServiceName
  discordId: string
  emailId: string
  webexId: string
  slackId: string
  webexVerified: Date | null
  slackVerified: Date | null
}

export const ChannelsPageContent = ({
  activeChannel: initialActiveChannel,
  discordId: initialDiscordId,
  emailId: initialEmailId,
  webexId: initialWebexId,
  slackId: initialSlackId,
  webexVerified: initialWebexVerified,
  slackVerified: initialSlackVerified,
}: ChannelsPageContentProps) => {
  const [activeChannel, setActiveChannel] =
    useState<ServiceName>(initialActiveChannel)

  const [channelIds, setChannelIds] = useState<ChannelIds>({
    DISCORD: initialDiscordId,
    EMAIL: initialEmailId,
    WEBEX: initialWebexId,
    SLACK: initialSlackId,
  })

  // State for verification modal
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationError, setVerificationError] = useState<string>()
  const [verificationSuccess, setVerificationSuccess] = useState<string>()
  const [currentVerifyingService, setCurrentVerifyingService] =
    useState<Exclude<ServiceName, "NONE">>()
  const [verificationStep, setVerificationStep] = useState<
    "sending" | "verifying"
  >("sending")

  // Two-factor form setup
  const form = useForm<{ code: string }>({
    defaultValues: {
      code: "",
    },
  })

  const { data: session } = useSession()

  // Verification mutation
  const verificationMutation = useMutation({
    mutationFn: async (params: {
      serviceName: Exclude<ServiceName, "NONE">
      serviceId: string
      code?: string
      userId?: string
    }) => {
      setVerificationStep(params.code ? "verifying" : "sending")
      return sendChannelVerification(
        params.serviceName,
        params.serviceId,
        params.code,
        params.userId
      )
    },
    onSuccess: (data) => {
      if (!data.success) {
        setVerificationStep("sending")
        setVerificationError(data.message || "Verification failed")
        setVerificationSuccess(undefined)
        return
      }
      setVerificationSuccess(data.message)
      setVerificationError(undefined)

      if (form.getValues().code) {
        setShowVerificationModal(false)
        if (currentVerifyingService === "WEBEX") {
          setWebexVerified(new Date())
        } else if (currentVerifyingService === "SLACK") {
          setSlackVerified(new Date())
        }
      }
    },
    onError: (error: any) => {
      setVerificationError(error.message || "Verification failed")
      setVerificationSuccess(undefined)
      setVerificationStep("sending")
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
  ]

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
    if (serviceName === "WEBEX") {
      setWebexVerified(null)
    } else if (serviceName === "SLACK") {
      setSlackVerified(null)
    }

    // If the value is empty, delete the ID from database
    if (!value.trim()) {
      try {
        const response = await fetch("/api/user/channel-id", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceName }),
        })

        if (!response.ok) {
          console.error("Server responded with:", await response.text())
          throw new Error("Failed to delete channel ID")
        }

        // If this was the active channel, reset local state
        if (activeChannel === serviceName) {
          setActiveChannel("NONE")
        }
      } catch (error) {
        console.error("Failed to delete channel ID:", error)
        // Revert local state on error
        setChannelIds((prev) => ({
          ...prev,
          [serviceName]: value,
        }))
      }
    }
  }

  const [isUpdating, setIsUpdating] = useState(false)

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
        // Optionally show an error toast/message
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

    verificationMutation.mutate({
      serviceName,
      serviceId: channelIds[serviceName],
      userId: session.user.id,
    })
    setCurrentVerifyingService(serviceName)
    setShowVerificationModal(true)
    // Reset previous verification states
    setVerificationError(undefined)
    setVerificationSuccess(undefined)
    form.reset()
  }

  const [webexVerified, setWebexVerified] = useState<Date | null>(
    initialWebexVerified
  )
  const [slackVerified, setSlackVerified] = useState<Date | null>(
    initialSlackVerified
  )

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
            <TableHead>Identifier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:text-gray-300">
          {serviceConfigs.map(({ name, displayName, placeholder }) => {
            const currentId = channelIds[name as keyof ChannelIds]
            const hasValidId = currentId?.trim().length > 0

            return (
              <TableRow key={name} className="dark:hover:bg-brand-950/40">
                <TableCell className="font-medium">
                  <div className="flex flex-row items-center gap-2 text-gray-600 dark:text-gray-300">
                    {displayName}
                  </div>
                </TableCell>
                <TableCell>
                  {hasValidId &&
                    ((name === "WEBEX" && webexVerified) ||
                      (name === "SLACK" && slackVerified) ||
                      name === "DISCORD" ||
                      name === "EMAIL") && (
                      <Switch
                        checked={activeChannel === name}
                        onCheckedChange={() =>
                          handleServiceToggle(
                            name as Exclude<ServiceName, "NONE">
                          )
                        }
                        disabled={isUpdating}
                        className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    )}
                </TableCell>
                <TableCell>
                  {hasValidId &&
                    ((name === "WEBEX" && !webexVerified) ||
                      (name === "SLACK" && !slackVerified)) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleVerify(name as Exclude<ServiceName, "NONE">)
                        }
                        disabled={verificationMutation.isPending}
                      >
                        {verificationMutation.isPending ? (
                          <>
                            Verifying
                            <Loader2 className="size-4 ml-2 animate-spin" />
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
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
      {/* Render instructions for active service */}
      {activeChannel === "DISCORD" && <InstructionsBox channel="discord" />}
      {activeChannel === "WEBEX" && <InstructionsBox channel="webex" />}
      {activeChannel === "SLACK" && <InstructionsBox channel="slack" />}
      {activeChannel === "EMAIL" && <InstructionsBox channel="email" />}

      {/* Verification Modal */}
      <Modal
        showModal={showVerificationModal}
        setShowModal={setShowVerificationModal}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Verify {currentVerifyingService} Channel
          </h2>

          <ChannelVerificationForm
            form={form}
            onSubmit={(values) => {
              if (!session?.user?.id) return
              verificationMutation.mutate({
                serviceName: currentVerifyingService!,
                serviceId: channelIds[currentVerifyingService!],
                code: values.code,
                userId: session.user.id,
              })
            }}
            error={verificationError}
            success={verificationSuccess}
            isPending={verificationMutation.isPending}
            serviceName={currentVerifyingService?.toLowerCase()}
            verificationStep={verificationStep}
          />
        </div>
      </Modal>
    </div>
  )
}
