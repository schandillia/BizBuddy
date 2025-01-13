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

interface AuthFormProps {
  onClose: () => void
}

export const AuthForm = ({ onClose }: AuthFormProps) => {
  const router = useRouter()
  const [isSignIn, setIsSignIn] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignIn) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Invalid email or password")
          return
        }

        router.refresh()
        onClose()
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Something went wrong")
          setLoading(false)
          return
        }

        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        router.refresh()
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-4 space-y-3 flex flex-col">
      <div className="text-center">
        <Heading as="h2">{isSignIn ? "Sign In" : "Create Account"}</Heading>
        <p className="text-xs text-gray-500">
          {isSignIn
            ? "Welcome back! Please sign in."
            : "Join us and get started."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {!isSignIn && (
          <Input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-sm"
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="text-sm"
        />

        <Input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="text-sm"
        />

        {!isSignIn && (
          <Input
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="text-sm"
          />
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full py-2 text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </form>

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
        onClick={() => setIsSignIn(!isSignIn)}
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
          By registering, you agree to {brand.BRAND}’s{" "}
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
