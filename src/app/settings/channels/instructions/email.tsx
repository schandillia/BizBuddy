// email.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const EmailInstructions: React.FC = () => {
  return (
    <>
      <h3>Setting Up Email Notifications: Step-by-Step Guide</h3>

      <p>
        Follow these instructions to set up Email notifications for your
        project. Don't worry if you're new to Email - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Email account. If you don't have one yet, you can create it
          for free at{" "}
          <a
            href="https://email.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            email.com
          </a>
        </li>
        <li>You need to be logged into Email in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default EmailInstructions
