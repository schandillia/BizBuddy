import { useState, useTransition } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, RegisterSchema, ResetSchema } from "@/schemas"
import { login } from "@/app/actions/login"
import { register } from "@/app/actions/register"
import { reset } from "@/app/actions/reset"
import { FormState } from "./types"
import { Header } from "./header"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { ResetForm } from "./reset-form"
import { TwoFactorForm } from "./two-factor-form"
import { Footer } from "./footer"
import { Socials } from "./socials"

export const AuthForm = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname() // More reliable than window.location.pathname
  const intent = searchParams.get("intent")

  // If the user is on the homepage ('/'), set the callbackUrl to '/dashboard'
  const finalCallbackUrl = pathname === "/" ? "/dashboard" : pathname

  // Append `intent` if it exists
  const redirectUrl = intent
    ? `${finalCallbackUrl}?intent=${intent}`
    : finalCallbackUrl

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : ""

  const [formState, setFormState] = useState<FormState>("login")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })

  const resetForm = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onLoginSubmit = (values: any) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      login(values, redirectUrl)
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

  const onRegisterSubmit = (values: any) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  const onResetSubmit = (values: any) => {
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
      <Header formState={formState} />

      {formState === "login" && (
        <LoginForm
          form={loginForm}
          onSubmit={onLoginSubmit}
          error={error}
          success={success}
          isPending={isPending}
          urlError={urlError}
          onForgotPassword={() => switchForm("reset")}
        />
      )}

      {formState === "register" && (
        <RegisterForm
          form={registerForm}
          onSubmit={onRegisterSubmit}
          error={error}
          success={success}
          isPending={isPending}
        />
      )}

      {formState === "reset" && (
        <ResetForm
          form={resetForm}
          onSubmit={onResetSubmit}
          error={error}
          success={success}
          isPending={isPending}
        />
      )}

      {formState === "2fa" && (
        <TwoFactorForm
          form={loginForm}
          onSubmit={onLoginSubmit}
          error={error}
          success={success}
          isPending={isPending}
        />
      )}

      <Footer formState={formState} onStateChange={switchForm} />

      {formState !== "2fa" && formState !== "reset" && <Socials />}
    </div>
  )
}

export default AuthForm
