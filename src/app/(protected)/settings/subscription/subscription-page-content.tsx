"use client"

import { Card } from "@/components/ui/card"
import { client } from "@/lib/client"
import { Plan } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ChartNoAxesCombined } from "lucide-react"
import { useRouter } from "next/navigation"
import brand from "@/lib/constants/brand.json"

export const SubscriptionPageContent = ({ plan }: { plan: Plan }) => {
  const router = useRouter()

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      const res = await client.payment.createCheckoutSession.$post()
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
  })

  const { data: usageData } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await client.project.getUsage.$get()
      return await res.json()
    },
  })

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900 dark:text-gray-400">
          {plan === "PRO" ? "Plan: Pro" : "Plan: Free"}
        </h1>
        <p className="text-sm/6 text-gray-600 dark:text-gray-300 max-w-prose">
          {plan === "PRO"
            ? `Thank you for supporting ${brand.BRAND}. Find your increased usage limits below.`
            : "Get access to more events, types and premium support."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>
            <ChartNoAxesCombined className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.eventsUsed || 0} of{" "}
              {usageData?.eventsLimit.toLocaleString() || 100}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Event Types</p>
            <ChartNoAxesCombined className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.typesUsed || 0} of{" "}
              {usageData?.typesLimit.toLocaleString() || 10}
            </p>
            <p className="text-xs/5 text-muted-foreground">Active types</p>
          </div>
        </Card>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Usage will reset{" "}
        {usageData?.resetDate ? (
          <>{format(usageData.resetDate, "MMM d, yyyy")} </>
        ) : (
          <span className="animate-pulse w-8 h-4 bg-gray-200"></span>
        )}
        {plan !== "PRO" ? (
          <span
            onClick={() => createCheckoutSession()}
            className="inline cursor-pointer underline text-brand-600"
          >
            or upgrade now to increase your limit
          </span>
        ) : null}
        .
      </p>
    </div>
  )
}
