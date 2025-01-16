// @/components/auth/auth-form/login-form.tsx
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
import { LoginValues } from "./types"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  form: UseFormReturn<LoginValues>
  onSubmit: (values: LoginValues) => void
  error?: string
  success?: string
  isPending: boolean
  urlError?: string
  onForgotPassword: () => void
}

export const LoginForm = ({
  form,
  onSubmit,
  error,
  success,
  isPending,
  urlError,
  onForgotPassword,
}: LoginFormProps) => (
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isPending}
                  {...field}
                  placeholder="••••••••"
                  type="password"
                  className="py-5"
                />
              </FormControl>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  className="px-0 font-normal text-sm"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormError message={error || urlError} />
      <FormSuccess message={success} />
      <Button
        disabled={isPending}
        type="submit"
        className="w-full py-5 text-base font-medium flex justify-center items-center" // Flexbox to center the loader and text
      >
        {isPending ? (
          <>
            Authenticating
            <Loader2 className="size-4 ml-2 animate-spin" />
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  </Form>
)
