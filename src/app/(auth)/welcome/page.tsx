// src/app/(auth)/welcome/page.tsx
"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { client } from "@/lib/client"
import { Heading } from "@/components/heading"
import { LoadingSpinner } from "@/components/loading-spinner"
import { BackgroundPattern } from "@/components/background-pattern"

const WelcomePage = () => {
  const router = useRouter()

  // Query to check user status
  const { data: statusData } = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: async () => {
      const res = await client.auth.getDatabaseSyncStatus.$get()
      return await res.json()
    },
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 1000
    },
  })

  // Mutation to create user
  const createUserMutation = useMutation({
    mutationFn: async () => {
      const res = await client.auth.createUser.$post()
      return await res.json()
    },
  })

  useEffect(() => {
    if (!statusData?.userExists && !statusData?.isSynced) {
      createUserMutation.mutate()
    }

    if (statusData?.isSynced) {
      router.push("/dashboard")
    }
  }, [statusData, router])

  return (
    <div className="flex w-full flex-1 items-center justify-center px-4 relative">
      <BackgroundPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />

      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-6 text-center">
        <LoadingSpinner size="md" />
        <Heading>Creating your account...</Heading>
        <p className="text-base/7 text-gray-600 max-w-prose">
          Just a moment while we set things up for you.
        </p>
      </div>
    </div>
  )
}

export default WelcomePage
