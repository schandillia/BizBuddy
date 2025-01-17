import React from "react"
import DiscordInstructions from "@/app/(protected)/settings/channels/instructions/discord"
import SlackInstructions from "@/app/(protected)/settings/channels/instructions/slack"
import WebexInstructions from "@/app/(protected)/settings/channels/instructions/webex"
import EmailInstructions from "@/app/(protected)/settings/channels/instructions/email"
import { Heading } from "@/components/heading"

type ChannelType = "discord" | "email" | "slack" | "webex"

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
      case "webex":
        return <WebexInstructions />
      case "email":
        return <EmailInstructions />
      default:
        return null
    }
  }

  const channelMap: Record<string, string> = {
    discord: "Discord",
    slack: "Slack",
    webex: "Webex",
    email: "Email",
  }

  const channelName = channelMap[channel.toLowerCase()] || null

  return (
    <>
      <Heading
        as="h2"
        className="text-gray-600 dark:text-gray-300 font-extrabold"
      >
        Setting up your {channelName}
      </Heading>
      <div className="prose lg:prose-lg prose-headings:text-gray-600 dark:prose-headings:text-gray-300 prose-strong:text-gray-600 dark:prose-strong:text-gray-300 prose-a:text-brand-800 dark:prose-a:text-brand-300 dark:prose-invert marker:text-brand-900 dark:marker:text-brand-100 max-w-full mx-auto bg-white dark:bg-brand-900 dark:border-brand-950 border-2 p-10 rounded-lg shadow-inner">
        {getInstructions()}
      </div>
    </>
  )
}

export default InstructionsBox
