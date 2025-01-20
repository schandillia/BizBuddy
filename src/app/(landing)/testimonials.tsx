import React from "react"
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Star } from "lucide-react"
import { CTAButton } from "@/components/cta-button"
import Image from "next/image"
import { Icons } from "@/components/icons"
import testimonialsData from "@/lib/constants/testimonials.json"

interface Testimonial {
  imageSrc: string
  name: string
  handle: string
  feedback: string
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-950 shadow-md transition-all duration-500 hover:scale-105">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="size-5 text-yellow-400 fill-yellow-400 dark:text-yellow-300 dark:fill-yellow-300"
        />
      ))}
    </div>

    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
      "{testimonial.feedback}"
    </p>

    <div className="flex items-center gap-4 mt-auto">
      <div className="relative">
        <Image
          src={`/images/${testimonial.imageSrc}`}
          className="rounded-full object-cover ring-2 ring-brand-500/20"
          alt={testimonial.name}
          width={56}
          height={56}
        />
        <Icons.verificationBadge className="size-5 absolute -bottom-1 -right-1 text-brand-500" />
      </div>

      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          {testimonial.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          @{testimonial.handle}
        </p>
      </div>
    </div>
  </div>
)

const Testimonials = () => {
  // Get 3 random testimonials
  const getRandomTestimonials = (count: number) => {
    const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const randomTestimonials = getRandomTestimonials(3)

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="absolute inset-0 bg-grid-gray-900/5 dark:bg-grid-white/5" />

      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
        <div>
          <h2 className="text-center text-base/7 font-semibold text-brand-600 dark:text-brand-300 uppercase">
            Real-World Experiences
          </h2>
          <Heading>What they’re saying</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
          {randomTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="flex justify-center">
          <CTAButton
            href="/sign-up"
            className="h-14 w-full max-w-80 text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Start for free today
          </CTAButton>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default Testimonials
