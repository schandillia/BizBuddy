// testimonials.tsx
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Star } from "lucide-react"
import { ShinyButton } from "@/components/shiny-button"
import Image from "next/image"
import { Icons } from "@/components/icons"
import testimonialsData from "@/lib/constants/testimonials.json" // Import testimonial data

interface Testimonial {
  imageSrc: string
  name: string
  handle: string
  feedback: string
}

const Testimonials = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-black">
      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
        <div>
          <h2 className="text-center text-base/7 font-semibold text-brand-600">
            Real-World Experiences
          </h2>
          <Heading className="text-center">What our customers say</Heading>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-brand-900">
          {testimonialsData.map((testimonial: Testimonial, index: number) => (
            <div
              key={index}
              className={`flex flex-auto flex-col gap-4 bg-brand-100 dark:bg-brand-800 shadow-md p-6 sm:p-8 lg:p-16 ${
                index === 0
                  ? "rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]"
                  : "rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]"
              }`}
            >
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 text-brand-600 fill-brand-600 dark:text-brand-200 dark:fill-brand-200"
                  />
                ))}
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 dark:text-gray-300 text-center lg:text-left text-pretty">
                {testimonial.feedback}
              </p>

              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src={testimonial.imageSrc}
                  className="rounded-full object-cover"
                  alt={testimonial.name}
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center text-gray-950 dark:text-white">
                    {testimonial.name}
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{testimonial.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ShinyButton
          href="/sign-up"
          className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          Start for free today
        </ShinyButton>
      </MaxWidthWrapper>
    </section>
  )
}

export default Testimonials
