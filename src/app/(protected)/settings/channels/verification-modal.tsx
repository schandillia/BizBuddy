"use client"

import { useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { ChannelVerificationForm } from "./channel-verification-form"
import { type ServiceName } from "@/types"
import { type Dispatch, type SetStateAction } from "react"
import { SERVICE_NAMES } from "./config"

type VerificationModalProps = {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  currentVerifyingService?: Exclude<ServiceName, "NONE">
  form: any
  onSubmit: (values: { code: string }) => void
  error?: string
  success?: string
  isPending: boolean
  verificationStep: "sending" | "verifying"
}

export function VerificationModal({
  showModal,
  setShowModal,
  currentVerifyingService,
  form,
  onSubmit,
  error,
  success,
  isPending,
  verificationStep,
}: VerificationModalProps) {
  useEffect(() => {
    if (showModal) {
      // Reset form state
      form.reset()

      // Focus first input
      setTimeout(() => {
        const firstInput = document.querySelector('input[data-input-idx="0"]')
        if (firstInput instanceof HTMLInputElement) {
          firstInput.focus()
        }
      }, 10)
    }
  }, [showModal, form])

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center dark:text-white">
          Verify your{" "}
          {currentVerifyingService
            ? SERVICE_NAMES[currentVerifyingService]
            : ""}{" "}
        </h2>

        <ChannelVerificationForm
          form={form}
          onSubmit={onSubmit}
          error={error}
          success={success}
          isPending={isPending}
          serviceName={currentVerifyingService as keyof typeof SERVICE_NAMES}
          verificationStep={verificationStep}
        />
      </div>
    </Modal>
  )
}
