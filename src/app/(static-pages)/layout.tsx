import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-black">
    <Navbar />
    <MaxWidthWrapper className="my-8 flex-1">{children}</MaxWidthWrapper>
    <Footer />
  </div>
)

export default Layout
