import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { UseFormReturn } from "react-hook-form"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Loader2 } from "lucide-react"

// Modified type to match the current use case
interface ChannelVerificationFormProps {
  form: UseFormReturn<{ code: string }>
  onSubmit: (values: { code: string }) => void
  error?: string
  success?: string
  isPending: boolean
  serviceName?: string
  verificationStep: "sending" | "verifying"
}

export const ChannelVerificationForm = ({
  form,
  onSubmit,
  error,
  success,
  isPending,
  serviceName,
  verificationStep,
}: ChannelVerificationFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* OTP Code Input Field */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center space-y-4">
            <FormControl>
              <InputOTP
                maxLength={6}
                disabled={isPending}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  // Automatically submit form once all OTP slots are filled
                  if (value.length === 6) {
                    form.handleSubmit(onSubmit)()
                  }
                }}
                aria-label="One-time password input"
              >
                <InputOTPGroup
                  className="flex justify-center gap-2"
                  aria-labelledby="otp-input-label"
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Informational text for users */}
      <p className="text-sm text-gray-500 text-center">
        Please enter the verification code sent to your {serviceName} channel
      </p>

      {/* Display any form errors */}
      <FormError message={error} />

      {/* Display success message if applicable */}
      <FormSuccess message={success} />

      {/* Submit button */}
      <Button
        disabled={isPending}
        type="submit"
        className="w-full py-5 text-base font-medium flex justify-center items-center"
        aria-live="polite"
      >
        {isPending ? (
          <>
            {verificationStep === "sending" ? "Sending code" : "Verifying code"}
            <Loader2 className="size-4 ml-2 animate-spin" />
          </>
        ) : (
          "Verify code"
        )}
      </Button>
    </form>
  </Form>
)
