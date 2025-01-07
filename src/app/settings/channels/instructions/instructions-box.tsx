import React from "react"
import DiscordInstructions from "@/app/settings/channels/instructions/discord"
import SlackInstructions from "@/app/settings/channels/instructions/slack"
// import WebexInstructions from "@/app/settings/channels/instructions/webex"
// import TeamsInstructions from "@/app/settings/channels/instructions/teams"

type ChannelType = "discord" | "slack" | "webex" | "teams" | "whatsapp"

interface InstructionsBoxProps {
  channel: ChannelType
}

const InstructionsBox: React.FC<InstructionsBoxProps> = ({ channel }) => {
  const getInstructions = () => {
    switch (channel.toLowerCase()) {
      case "discord":
        return <DiscordInstructions />
      case "slack":
        return <SlackInstructions />
      // Add other cases as components are created
      // case "webex":
      //   return <WebexInstructions />
      // case "teams":
      //   return <TeamsInstructions />
      default:
        return null
    }
  }

  return (
    <div className="prose lg:prose-lg prose-headings:text-gray-600 dark:prose-headings:text-gray-400 prose-strong:text-gray-600 dark:prose-strong:text-gray-400 prose-a:text-brand-800 dark:prose-a:text-brand-300 dark:prose-invert marker:text-brand-800 dark:marker:text-brand-200/70 max-w-full mx-auto bg-brand-25 dark:bg-brand-900/60 p-10 rounded-lg shadow-md">
      {getInstructions()}
    </div>
  )
}

export default InstructionsBox
