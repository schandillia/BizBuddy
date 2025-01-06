"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import brand from "@/lib/constants/brand.json"
import { FaLock } from "react-icons/fa"

interface PricingTierProps {
  features: string[]
  price: number
  onGetAccess: () => void
  description: string
  title: string
}

const PricingTier = ({
  features,
  price,
  onGetAccess,
  description,
  title,
}: PricingTierProps) => {
  return (
    <div className="bg-white dark:bg-brand-900 mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-brand-800 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-3xl font-heading font-semibold tracking-tight text-gray-600 dark:text-gray-400">
          {title}
        </h3>

        <p className="mt-6 text-base/7 text-gray-700 dark:text-white/70">
          {description}
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
            What’s included
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-700 dark:text-white/70 sm:grid-cols-2 sm:gap-6">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <CheckIcon className="h-6 w-5 flex-none text-brand-700" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
        <div className="rounded-2xl bg-gray- dark:bg-brand-950 py-10 text-center ring-1 ring-inset ring-gray-900/5 dark:ring-brand-700 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs py-8">
            <p className="text-base font-semibold text-gray-700 dark:text-white/70">
              Pay once, own forever
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-700 dark:text-white/70">
                ${price}
              </span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-gray-700 dark:text-white/70">
                /MO
              </span>
            </p>

            <Button onClick={onGetAccess} className="mt-6 px-20">
              Get {brand.BRAND}
            </Button>
            <div className="flex items-center space-x-2 mt-2">
              <span className="flex items-center">
                <FaLock className="size-3 text-gray-700 dark:text-white/70" />{" "}
              </span>
              <p className="text-xs leading-5 text-gray-700 dark:text-white/70">
                Secure payment. Start monitoring in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingTier
