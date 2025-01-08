// whatsapp.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const WhatsappInstructions: React.FC = () => {
  return (
    <>
      <p>
        Follow these instructions to set up Whatsapp notifications for your
        project. Don't worry if you're new to Whatsapp - we'll walk you through
        every step!
      </p>

      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Whatsapp account. If you don't have one yet, you can create
          it for free at{" "}
          <a
            href="https://whatsapp.com/register"
            target="_blank"
            rel="noreferrer noopener"
          >
            whatsapp.com
          </a>
        </li>
        <li>You need to be logged into Whatsapp in your browser</li>
      </ul>

      {/* Rest of the existing content */}
    </>
  )
}

export default WhatsappInstructions
