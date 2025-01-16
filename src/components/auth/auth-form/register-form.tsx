// @/components/auth/auth-form/register-form.tsx
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
import { RegisterValues } from "./types"

interface RegisterFormProps {
  form: UseFormReturn<RegisterValues>
  onSubmit: (values: RegisterValues) => void
  error?: string
  success?: string
  isPending: boolean
}

export const RegisterForm = ({
  form,
  onSubmit,
  error,
  success,
  isPending,
}: RegisterFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isPending}
                  {...field}
                  placeholder="Full Name"
                  className="py-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
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
        className="w-full py-5 text-base font-medium"
      >
        Create Account
      </Button>
    </form>
  </Form>
)
