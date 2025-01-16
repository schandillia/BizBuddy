// @/components/auth/auth-form/reset-form.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { ResetValues } from "./types"
import { Loader2 } from "lucide-react"

interface ResetFormProps {
  form: UseFormReturn<ResetValues>
  onSubmit: (values: ResetValues) => void
  error?: string
  success?: string
  isPending: boolean
}

export const ResetForm = ({
  form,
  onSubmit,
  error,
  success,
  isPending,
}: ResetFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isPending}
                  {...field}
                  placeholder="you@example.com"
                  type="email"
                  className="py-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormError message={error} />
      <FormSuccess message={success} />
      <Button
        disabled={isPending}
        type="submit"
        className="w-full py-5 text-base font-medium flex justify-center items-center" // Flexbox to center the loader and text
      >
        {isPending ? (
          <>
            Sending reset email
            <Loader2 className="size-4 ml-2 animate-spin" />
          </>
        ) : (
          "Send reset email"
        )}
      </Button>
    </form>
  </Form>
)
