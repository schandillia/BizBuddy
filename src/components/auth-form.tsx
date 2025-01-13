"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { signInWithGoogle } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import brand from "@/lib/constants/brand.json"
import Link from "next/link"
import DividerWithText from "./divider-with-text"
import { FcGoogle } from "react-icons/fc"
import { Heading } from "./heading"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
})

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

interface AuthFormProps {
  onClose: () => void
}

export const AuthForm = ({ onClose }: AuthFormProps) => {
  const router = useRouter()
  const [isSignIn, setIsSignIn] = useState(true)
  const [loading, setLoading] = useState(false)

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const onSignInSubmit: SubmitHandler<SignInForm> = async (data) => {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Invalid email or password")
      }

      router.refresh()
      onClose()
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onSignUpSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Something went wrong")
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      router.refresh()
      onClose()
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignIn(!isSignIn)
    signInForm.reset()
    signUpForm.reset()
  }

  return (
    <div className="w-full max-w-md p-4 space-y-3 flex flex-col">
      <div className="text-center">
        <Heading as="h2">{isSignIn ? "Sign In" : "Create Account"}</Heading>
        <p className="text-xs text-gray-400">
          {isSignIn
            ? "Welcome back! Please sign in."
            : "Join us and get started."}
        </p>
      </div>

      {isSignIn ? (
        <form
          onSubmit={signInForm.handleSubmit(onSignInSubmit)}
          className="space-y-2"
        >
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...signInForm.register("email")}
              className="text-sm"
            />
            {signInForm.formState.errors.email && (
              <p className="text-xs text-red-500">
                {signInForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...signInForm.register("password")}
              className="text-sm"
            />
            {signInForm.formState.errors.password && (
              <p className="text-xs text-red-500">
                {signInForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
          className="space-y-2"
        >
          <div>
            <Input
              type="text"
              placeholder="Name"
              {...signUpForm.register("name")}
              className="text-sm"
            />
            {signUpForm.formState.errors.name && (
              <p className="text-xs text-red-500">
                {signUpForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              {...signUpForm.register("email")}
              className="text-sm"
            />
            {signUpForm.formState.errors.email && (
              <p className="text-xs text-red-500">
                {signUpForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...signUpForm.register("password")}
              className="text-sm"
            />
            {signUpForm.formState.errors.password && (
              <p className="text-xs text-red-500">
                {signUpForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...signUpForm.register("confirmPassword")}
              className="text-sm"
            />
            {signUpForm.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {signUpForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      )}

      <DividerWithText text="OR CONTINUE WITH" />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="size-6" />
      </Button>

      <Button
        variant="link"
        className="w-full text-sm text-decoration-line: underline"
        onClick={toggleMode}
      >
        {isSignIn
          ? "Don't have an account? Sign up"
          : "Already have an account?"}
      </Button>

      {isSignIn && (
        <Button
          variant="link"
          className="w-full text-xs"
          onClick={() => router.push("/auth/forgot-password")}
        >
          Forgot password?
        </Button>
      )}

      {!isSignIn && (
        <p className="text-xs text-center text-gray-400">
          By registering, you agree to {brand.BRAND}'s{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </div>
  )
}
