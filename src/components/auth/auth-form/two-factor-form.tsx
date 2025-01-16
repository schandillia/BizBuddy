// @/components/auth/auth-form/two-factor-form.tsx
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  if (value.length === 6) {
                    form.handleSubmit(onSubmit)()
                  }
                }}
                autoFocus
              >
                <InputOTPGroup className="flex justify-center gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="text-sm text-gray-500 text-center">
        Please enter the one-time password sent to your phone
      </p>
      <FormError message={error} />
      <FormSuccess message={success} />
      <Button
        disabled={isPending}
        type="submit"
        className="w-full py-5 text-base font-medium"
      >
        Verify Code
      </Button>
    </form>
  </Form>
)
