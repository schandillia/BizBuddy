// teams.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const TeamsInstructions: React.FC = () => {
  return (
    <>
      <h3>Setting Up Teams Notifications: Step-by-Step Guide</h3>

      <p>
        Follow these instructions to set up Teams notifications for your
        project. Don't worry if you're new to Teams - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Teams account. If you don't have one yet, you can create it
          for free at{" "}
          <a
            href="https://teams.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            teams.com
          </a>
        </li>
        <li>You need to be logged into Teams in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default TeamsInstructions
