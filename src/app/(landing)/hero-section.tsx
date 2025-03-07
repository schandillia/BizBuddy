import { CTAButton } from "@/components/cta-button"
import CyclingText from "@/components/cycling-text"
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import brand from "@/lib/constants/brand.json"
import features from "@/lib/constants/features.json"
import { CircleCheck, Sparkles } from "lucide-react"
import HeroIllustration from "@/app/(landing)/hero-illustration" // Add this import

const HeroSection = () => {
  return (
    <section className="relative py-24 sm:py-32 sm:pt-12 bg-brand-25 dark:bg-brand-950">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

      <MaxWidthWrapper>
        <div className="flex">
          {/* Left */}
          <div className="flex-grow md:basis-2/3">
            <div className="relative mx-auto flex flex-col items-center sm:items-start gap-8 sm:gap-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-300/30 dark:bg-brand-500/5">
                <Sparkles className="size-4 text-brand-600 dark:text-brand-300" />
                <span className="text-sm font-medium text-brand-600 dark:text-brand-300">
                  Now with enhanced analytics
                </span>
              </div>

              {/* Heading */}
              <Heading className="flex flex-col gap-y-2 w-full text-center sm:text-left">
                <span className="text-3xl sm:text-5xl font-bold">
                  Real-Time Business Insights,
                </span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center sm:items-baseline">
                  <span className="text-2xl sm:text-5xl bg-gradient-to-r from-brand-500 to-brand-800 dark:from-brand-200 dark:to-brand-400 text-transparent bg-clip-text pb-1">
                    Delivered Straight to Your
                  </span>
                  <CyclingText
                    words={["Email", "Discord", "Slack", "Webex"]}
                    interval={1000}
                    className="text-2xl sm:text-5xl"
                  />
                </div>
              </Heading>

              {/* Description */}
              <p className="text-base/7 text-gray-600 dark:text-gray-300 max-w-prose text-center sm:text-left">
                Stay on top of your business with {brand.BRAND}'s instant
                notifications for key events like{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-100">
                  sales and new sign-ups
                </span>
                . Get updates via email, Discord, Slack, or Webex.
              </p>

              {/* Features grid - now a single column list on mobile */}
              <ul className="w-full max-w-[320px] space-y-4 sm:space-y-0 sm:max-w-2xl sm:grid sm:grid-cols-2 sm:gap-4 text-base/7 text-gray-600 dark:text-gray-300">
                {features.features.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 sm:justify-start"
                  >
                    <CircleCheck className="size-5 shrink-0 text-brand-700 dark:text-brand-300 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <CTAButton href="/sign-up" className="relative z-10">
                Start for free today
              </CTAButton>
            </div>
          </div>
          {/* Right */}
          {/* <div className="hidden md:flex h-full items-center justify-center">
            <HeroIllustration className="max-w-full max-h-[400px] w-full" />
          </div> */}
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default HeroSection
