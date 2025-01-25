import React, { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { ChannelVerificationForm } from "@/app/(protected)/settings/channels/channel-verification-form"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { sendChannelVerification } from "@/app/actions/send-channel-verification"

export function ChannelsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()
  const [currentVerifyingService, setCurrentVerifyingService] =
    useState<string>()
  const [verificationStep, setVerificationStep] = useState<
    "sending" | "verifying"
  >("sending")

  const form = useForm<{ code: string }>({
    defaultValues: {
      code: "",
    },
  })

  const verificationMutation = useMutation({
    mutationFn: async (params: {
      serviceName: string
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
      }
    },
  })

  const onVerificationSuccess = () => {
    setIsModalOpen(false)
    // Optionally refresh the page or update the UI
    window.location.reload()
  }

  return (
    <>
      <Modal showModal={isModalOpen} setShowModal={setIsModalOpen}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Verify {currentVerifyingService}
          </h2>
          <ChannelVerificationForm
            form={form}
            onSubmit={(values) => {
              if (!session?.user?.id) return
              verificationMutation.mutate({
                serviceName: currentVerifyingService!,
                serviceId: values.code,
                code: values.code,
                userId: session.user.id,
              })
            }}
            error={verificationMutation.error?.message}
            success={
              verificationMutation.data?.success && !verificationMutation.error
                ? verificationMutation.data.message
                : undefined
            }
            isPending={verificationMutation.isPending}
            serviceName={currentVerifyingService?.toLowerCase()}
            verificationStep={verificationStep}
          />
        </div>
      </Modal>
    </>
  )
}
