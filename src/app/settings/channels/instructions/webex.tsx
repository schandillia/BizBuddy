// webex.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const WebexInstructions: React.FC = () => {
  return (
    <>
      <p>
        Follow these instructions to set up Webex notifications for your
        project. Don't worry if you're new to Webex - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Webex account. If you don't have one yet, you can create it
          for free at{" "}
          <a
            href="https://webex.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            webex.com
          </a>
        </li>
        <li>You need to be logged into Webex in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default WebexInstructions
