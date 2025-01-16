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
import { LoginValues } from "./types"
import { Loader2 } from "lucide-react"

interface TwoFactorFormProps {
  form: UseFormReturn<LoginValues>
  onSubmit: (values: LoginValues) => void
  error?: string
  success?: string
  isPending: boolean
}

export const TwoFactorForm = ({
  form,
  onSubmit,
  error,
  success,
  isPending,
}: TwoFactorFormProps) => (
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      autoFocus
    >
      {/* OTP Code Input Field */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center space-y-4" autoFocus>
            {/* Wrapping the input field with FormControl */}
            <FormControl>
              {/* OTP Input */}
              <InputOTP
                maxLength={6}
                disabled={isPending} // Disable input if submission is in progress
                value={field.value}
                onChange={(value) => {
                  // Handle OTP input change
                  field.onChange(value)
                  // Automatically submit form once all OTP slots are filled
                  if (value.length === 6) {
                    form.handleSubmit(onSubmit)()
                  }
                }}
                aria-label="One-time password input" // Adds a descriptive label for screen readers
                autoFocus
              >
                {/* OTP Slots for each digit */}
                <InputOTPGroup
                  className="flex justify-center gap-2"
                  aria-labelledby="otp-input-label" // Associate the input group with the label for screen readers
                >
                  {/* Individual OTP slots */}
                  <InputOTPSlot index={0} aria-label="OTP digit 1" />
                  <InputOTPSlot index={1} aria-label="OTP digit 2" />
                  <InputOTPSlot index={2} aria-label="OTP digit 3" />
                  <InputOTPSlot index={3} aria-label="OTP digit 4" />
                  <InputOTPSlot index={4} aria-label="OTP digit 5" />
                  <InputOTPSlot index={5} aria-label="OTP digit 6" />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            {/* Form message to show validation errors */}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Informational text for users */}
      <p className="text-sm text-gray-500 text-center">
        Please enter the one-time password sent to your phone
      </p>

      {/* Display any form errors */}
      <FormError message={error} />

      {/* Display success message if applicable */}
      <FormSuccess message={success} />

      {/* Submit button */}
      <Button
        disabled={isPending} // Disable button when form is being submitted
        type="submit"
        className="w-full py-5 text-base font-medium flex justify-center items-center" // Flexbox to center the loader and text
        aria-live="polite" // Allows screen readers to announce button state changes
      >
        {isPending ? (
          <>
            Verifying Code
            <Loader2 className="size-4 ml-2 animate-spin" />
          </>
        ) : (
          "Verify Code"
        )}
      </Button>
    </form>
  </Form>
)
