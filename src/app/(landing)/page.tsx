import Testimonials from "@/app/(landing)/testimonials"
import HeroSection from "@/app/(landing)/hero-section"
import ChannelDemo from "@/app/(landing)/channel-demo"
import BentoSection from "@/app/(landing)/bento-section"

const Page = () => {
  return (
    <>
      <HeroSection />
      <ChannelDemo />
      <BentoSection />
      <Testimonials />
    </>
  )
}

export default Page
