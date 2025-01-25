"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { sendChannelVerification } from "@/app/actions/send-channel-verification"
import { type ServiceName } from "@/types"

export function useChannelVerification() {
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationError, setVerificationError] = useState<string>()
  const [verificationSuccess, setVerificationSuccess] = useState<string>()
  const [currentVerifyingService, setCurrentVerifyingService] =
    useState<Exclude<ServiceName, "NONE">>()
  const [verificationStep, setVerificationStep] = useState<
    "sending" | "verifying"
  >("sending")

  const form = useForm<{ code: string }>({
    defaultValues: { code: "" },
  })

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
    },
    onError: (error: any) => {
      setVerificationError(error.message || "Verification failed")
      setVerificationSuccess(undefined)
      setVerificationStep("sending")
    },
  })

  useEffect(() => {
    if (showVerificationModal) {
      setVerificationError(undefined)
      setVerificationSuccess(undefined)
      form.reset()
    }
  }, [showVerificationModal, form])

  return {
    showVerificationModal,
    setShowVerificationModal,
    verificationError,
    setVerificationError,
    verificationSuccess,
    setVerificationSuccess,
    currentVerifyingService,
    setCurrentVerifyingService,
    verificationStep,
    form,
    verificationMutation,
  }
}
