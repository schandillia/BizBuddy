import CyclingText from "@/components/cycling-text"
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { ShinyButton } from "@/components/shiny-button"
import { Check, Sparkles } from "lucide-react"
import brand from "@/lib/constants/brand.json"
import features from "@/lib/constants/features.json"

const HeroSection = () => {
  return (
    <section
      className="relative py-24 sm:py-32 sm:pt-12 bg-brand-25 dark:bg-brand-950"
      // To add a background animation, uncomment the following
      // style={{
      //   backgroundImage: `url('/images/landing.svg')`,
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      //   backgroundSize: "cover",
      // }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

      <MaxWidthWrapper className="text-center">
        <div className="relative mx-auto text-center flex flex-col items-center gap-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30">
            <Sparkles className="size-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Now with enhanced analytics
            </span>
          </div>
          <Heading className="flex flex-col gap-y-2">
            <span>Real-Time Business Insights,</span>
            <div className="pt-1 pb-2">
              <span className="relative bg-gradient-to-r from-brand-500 to-brand-800 text-transparent bg-clip-text mt-2">
                Delivered Straight to Your
              </span>
            </div>
            <div className="text-center">
              <CyclingText
                words={["Email", "Discord", "Slack", "Webex"]}
                interval={1000}
              />
            </div>
          </Heading>

          <p className="text-base/7 text-gray-600 dark:text-gray-300 max-w-prose text-center text-pretty">
            Stay on top of your business with {brand.BRAND}’s instant
            notifications for key events like{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-100">
              sales and new sign-ups
            </span>
            . Get updates via email, Discord, Slack, or Webex.
          </p>

          <ul className="space-y-2 text-base/7 text-gray-600 dark:text-gray-300 text-left flex flex-col items-start">
            {features.features.map((item, index) => (
              <li key={index} className="flex gap-1.5 items-center text-left">
                <Check className="size-5 shrink-0 text-brand-700" />
                {item}
              </li>
            ))}
          </ul>

          <div className="w-full max-w-80">
            <ShinyButton
              href="/sign-up"
              className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              Start for free today
            </ShinyButton>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default HeroSection
