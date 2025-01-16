import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const WebexInstructions: React.FC = () => {
  return (
    <>
      <p>
        Follow these instructions to set up Webex notifications for your
        project. Don't worry if you're new to Webex – we’ll guide you through
        every step!
      </p>
      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Webex account. If you don’t have one yet, you can create it
          for free at{" "}
          <a
            href="https://signup.webex.com/sign-up"
            target="_blank"
            rel="noreferrer noopener"
          >
            webex.com
          </a>
        </li>
        <li>You need to be logged into Webex in your browser or on your app</li>
      </ul>
      <h4>Setup Steps</h4>
      <ol>
        <li>
          <strong>Search for Our Bot in Webex</strong>
          <ul>
            <li>
              Open Webex and go to your space or create a new one if needed.
            </li>
            <li>
              Use the search bar to find our bot by searching for its username:{" "}
              <strong>{channelConfig.WEBEX_BOT_USERNAME}</strong>.
            </li>
            <li>
              Once you find the bot, click on it and choose to add it to your
              space.
            </li>
          </ul>
        </li>

        <li>
          <strong>Authorize the Bot</strong>
          <ul>
            <li>
              Review the permissions the bot is requesting to join your space.
            </li>
            <li>
              Click the "Add" button to confirm and allow the bot access to the
              space.
            </li>
            <li>
              You might need to verify your account or confirm the action in a
              pop-up.
            </li>
          </ul>
        </li>

        <li>
          <strong>Verify the Setup</strong>
          <ul>
            <li>Go to the Webex space you added the bot to.</li>
            <li>You should see our bot listed as a member of the space.</li>
            <li>
              The bot will send a welcome message to the space once added.
            </li>
          </ul>
        </li>
      </ol>
      <h4>Troubleshooting</h4>
      <ul>
        <li>
          If you can't find the bot, make sure you're logged into Webex in your
          browser.
        </li>
        <li>
          If the bot doesn’t appear, try searching for its username again:{" "}
          <strong>{channelConfig.WEBEX_BOT_USERNAME}</strong>.
        </li>
        <li>
          If the bot doesn't send a welcome message, check that it has
          permission to post in your space.
        </li>
      </ul>
      <p>
        Once these steps are complete, you'll start receiving notifications from
        our bot in your Webex space. You can always adjust which space or
        channel receives notifications by using Webex's space settings.
      </p>
    </>
  )
}

export default WebexInstructions
