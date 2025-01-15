import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heading } from "@/components/heading"
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
import { useForm } from "react-hook-form"
import { LoginSchema, RegisterSchema, ResetSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { login } from "@/app/actions/login"
import { register } from "@/app/actions/register"
import { reset } from "@/app/actions/reset"
import { useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import DividerWithText from "@/components/divider-with-text"
import { FcGoogle } from "react-icons/fc"
import { signInWithGoogle } from "@/app/actions/auth"

const Socials = () => (
  <div className="w-full space-y-3">
    <DividerWithText text="OR CONTINUE WITH" />
    <div className="flex flex-row gap-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="size-5" />
        <span className="text-sm font-medium"></span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="size-5" />
        <span className="text-sm font-medium"></span>
      </Button>
    </div>
  </div>
)

type FormState = "login" | "register" | "reset" | "2fa"

export const AuthForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || undefined
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : ""

  const [formState, setFormState] = useState<FormState>("login")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })

  const resetForm = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onLoginSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            loginForm.reset()
            setError(data.error)
          }

          if (data?.success) {
            loginForm.reset()
            setSuccess(data.success)
          }

          if (data?.twoFactor) {
            setFormState("2fa")
          }
        })
        .catch(() => setError("Something went wrong."))
    })
  }

  const onRegisterSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  const onResetSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
  }

  const switchForm = (state: FormState) => {
    setFormState(state)
    setError("")
    setSuccess("")
    loginForm.reset()
    registerForm.reset()
    resetForm.reset()
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="text-center space-y-1">
        <Heading as="h2" className="text-2xl font-bold tracking-tight">
          {formState === "register" && "Create Account"}
          {formState === "login" && "Welcome Back"}
          {formState === "reset" && "Reset Password"}
          {formState === "2fa" && "Two-Factor Authentication"}
        </Heading>
        <p className="text-sm text-gray-500">
          {formState === "register" && "Create your account to get started"}
          {formState === "login" && "Please enter your credentials to continue"}
          {formState === "reset" && "Enter your email to reset your password"}
          {formState === "2fa" && "Enter the code sent to your phone"}
        </p>
      </div>

      {formState === "login" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <FormField
                control={loginForm.control}
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
                control={loginForm.control}
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
                        onClick={() => switchForm("reset")}
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
              className="w-full py-5 text-base font-medium"
            >
              Sign In
            </Button>
          </form>
        </Form>
      )}

      {formState === "register" && (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <FormField
                control={registerForm.control}
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
                control={registerForm.control}
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
                control={registerForm.control}
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
                control={registerForm.control}
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
      )}

      {formState === "reset" && (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <FormField
                control={resetForm.control}
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
              className="w-full py-5 text-base font-medium"
            >
              Send reset email
            </Button>
          </form>
        </Form>
      )}

      {formState === "2fa" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      disabled={isPending}
                      onChange={field.onChange}
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
      )}

      <div className="text-center -mt-2">
        {formState === "reset" ? (
          <Button
            variant="link"
            className="font-normal text-sm"
            onClick={() => switchForm("login")}
          >
            Back to login
          </Button>
        ) : (
          <Button
            variant="link"
            className="font-normal text-sm"
            onClick={() =>
              switchForm(formState === "register" ? "login" : "register")
            }
          >
            {formState === "register"
              ? "Already have an account?"
              : "Don't have an account?"}
          </Button>
        )}
      </div>

      {formState !== "2fa" && formState !== "reset" && <Socials />}
    </div>
  )
}
