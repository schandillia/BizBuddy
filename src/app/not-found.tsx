import { Heading } from "@/components/heading"

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <Heading as="h2" className="text-xl">
        <span>404</span>
      </Heading>
      <div className="border-l border-gray-300 mx-4 h-8"></div>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        <span>Page Not Found</span>
      </p>
    </div>
  )
}

export default Custom404
