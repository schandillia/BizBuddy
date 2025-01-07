// slack.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const SlackInstructions: React.FC = () => {
  return (
    <>
      <h3>Setting Up Slack Notifications: Step-by-Step Guide</h3>

      <p>
        Follow these instructions to set up Slack notifications for your
        project. Don't worry if you're new to Slack - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Slack account. If you don't have one yet, you can create it
          for free at{" "}
          <a
            href="https://slack.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            slack.com
          </a>
        </li>
        <li>You need to be logged into Slack in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default SlackInstructions
