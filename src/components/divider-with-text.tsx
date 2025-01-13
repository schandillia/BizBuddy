import React from "react"

interface DividerWithTextProps {
  text?: string
  className?: string // Add className prop for more styling control
}

const DividerWithText = ({ text = "OR", className }: DividerWithTextProps) => {
  return (
    <div className={`flex items-center space-x-2 py-4 ${className}`}>
      {" "}
      {/* Added className prop */}
      <div className="flex-grow border-t border-gray-600 dark:border-gray-300"></div>
      {/* flex-grow here */}
      <span className="text-xs whitespace-nowrap text-gray-600 dark:text-gray-300 font-semibold">
        {text}
      </span>
      {/* whitespace-nowrap */}
      <div className="flex-grow border-t border-gray-600 dark:border-gray-300"></div>
      {/* flex-grow here */}
    </div>
  )
}

export default DividerWithText
