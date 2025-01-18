import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-brand-950">
      <Navbar />
      <main className="flex-1 relative z-0 bg-gray-50 dark:bg-black p-4 md:p-6 space-y-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
