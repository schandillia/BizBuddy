"use client"

import { NewVerification } from "@/app/actions/new-verification"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token.")
      return
    }
    NewVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError("Something went wrong.")
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  // Set headerLabel dynamically based on success or error
  let headerLabel = "Confirming your email"

  if (success) {
    headerLabel = "Your email has been confirmed"
  } else if (error) {
    headerLabel = "There was an issue confirming your email"
  }

  return (
    <CardWrapper
      headerTitle="Confirmation" // Static title
      headerLabel={headerLabel} // Dynamic label based on state
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center w-full justify-center space-y-4 mt-6">
        {!success && !error && <Loader2 className="animate-spin" size={24} />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
