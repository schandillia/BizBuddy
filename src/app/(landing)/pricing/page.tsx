"use client"

import PricingTier from "./pricing-tier"
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import brand from "@/lib/constants/brand.json"

const Page = () => {
  const { user } = useUser()
  const router = useRouter()

  const INCLUDED_FEATURES = [
    "10.000 real-time events per month",
    "10 event types",
    "Advanced analytics and insights",
    "Priority support",
  ]

  const { mutate: createCheckoutSession } = useMutation({
    // ... rest of your mutation code
  })

  const handleGetAccess = () => {
    if (user) {
      createCheckoutSession()
    } else {
      router.push("/sign-in?intent=upgrade")
    }
  }

  return (
    <div className="bg-brand-25 dark:bg-brand-950 py-24 sm:py-32 sm:pt-12">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading className="text-center">Simple no-tricks pricing</Heading>
          <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300 max-w-prose text-center text-pretty">
            We hate subscriptions. And chances are, you do too. That's why we
            offer lifetime access to {brand.BRAND} for a one-time payment.
          </p>
        </div>

        <PricingTier
          features={INCLUDED_FEATURES}
          price={0}
          title="Starter"
          description={`Invest once in ${brand.BRAND} and transform how you monitor your SaaS forever. Get instant alerts, track critical metrics and never miss a beat in your business growth.`}
          onGetAccess={handleGetAccess}
        />
        <PricingTier
          features={INCLUDED_FEATURES}
          price={49}
          title="Pro"
          description={`Invest once in ${brand.BRAND} and transform how you monitor your SaaS forever. Get instant alerts, track critical metrics and never miss a beat in your business growth.`}
          onGetAccess={handleGetAccess}
        />
      </MaxWidthWrapper>
    </div>
  )
}

export default Page
