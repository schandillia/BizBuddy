import Testimonials from "@/app/(landing)/testimonials"
import AboveTheFold from "@/app/(landing)/above-the-fold"
import ChannelDemo from "@/app/(landing)/channel-demo"
import BentoSection from "@/app/(landing)/bento-section"

const Page = () => {
  return (
    <>
      <AboveTheFold />
      <ChannelDemo />
      <BentoSection />
      <Testimonials />
    </>
  )
}

export default Page
