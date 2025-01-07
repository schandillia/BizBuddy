// discord.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const DiscordInstructions: React.FC = () => {
  return (
    <>
      <h3>Setting Up Discord Notifications: Step-by-Step Guide</h3>

      <p>
        Follow these instructions to set up Discord notifications for your
        project. Don't worry if you're new to Discord - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Discord account. If you don't have one yet, you can create
          it for free at{" "}
          <a
            href="https://discord.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            discord.com
          </a>
        </li>
        <li>You need to be logged into Discord in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default DiscordInstructions
