// discord.tsx
import React from "react"
import channelConfig from "@/lib/constants/channels.json"

const DiscordInstructions: React.FC = () => {
  return (
    <>
      <p>
        Follow these instructions to set up Discord notifications for your
        project. Don't worry if you're new to Discord - we’ll walk you through
        every step!
      </p>
      <h4>Prerequisites</h4>
      <ul>
        <li>
          You need a Discord account. If you don’t have one yet, you can create
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
      <h4>Setup Steps</h4>
      <ol>
        <li>
          <strong>Add Our Bot to Discord</strong>
          <ul>
            <li>
              Click this link to add our service bot to Discord:{" "}
              <a
                href={channelConfig.DISCORD_APP_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                {channelConfig.DISCORD_APP_URL}
              </a>
            </li>
            <li>This will open Discord’s authorization page in a new tab</li>
          </ul>
        </li>

        <li>
          <strong>Choose Where to Add the Bot</strong>
          <ul>
            <li>
              You'll see a popup with two buttons: "Add to My Apps" and "Add to
              Server"
            </li>
            <li>
              Click the <strong>Add to Server</strong> button
            </li>
            <li>A dropdown menu labeled "ADD TO SERVER" will appear</li>
          </ul>
        </li>

        <li>
          <strong>Select or Create a Server</strong>
          <ul>
            <li>
              If you already have a Discord server:
              <ul>
                <li>Select it from the dropdown menu</li>
                <li>
                  Make sure you have administrator permissions for that server
                </li>
              </ul>
            </li>
            <li>
              If you don't have a server yet:
              <ul>
                <li>
                  Click the "Create a Server" button at the bottom of the
                  dropdown
                </li>
                <li>Choose "For me and my friends"</li>
                <li>Enter a name for your server and click "Create"</li>
                <li>
                  Return to our bot's authorization page and select your new
                  server
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Authorize the Bot</strong>
          <ul>
            <li>Review the permissions the bot is requesting</li>
            <li>
              Scroll down to see the <strong>Authorize</strong> button
            </li>
            <li>
              Click <strong>Authorize</strong> to add the bot to your server
            </li>
            <li>You might need to complete a CAPTCHA verification</li>
          </ul>
        </li>

        <li>
          <strong>Verify the Setup</strong>
          <ul>
            <li>Go to your Discord server</li>
            <li>
              You should see our bot listed in the members section (usually on
              the right side)
            </li>
            <li>
              The bot will send a welcome message in your server's general
              channel
            </li>
          </ul>
        </li>
      </ol>
      <h4>Troubleshooting</h4>
      <ul>
        <li>
          If you don't see the "Add to Server" option, make sure you're logged
          into Discord in your browser
        </li>
        <li>
          If you can't select a server, you need administrator permissions for
          that server
        </li>
        <li>
          If the bot doesn't send a welcome message, check if it has permission
          to send messages in your server
        </li>
      </ul>
      <p>
        Once these steps are complete, you'll start receiving notifications from
        our bot in your Discord server. You can always adjust which channel
        receives notifications by using Discord's channel settings.
      </p>
    </>
  )
}

export default DiscordInstructions
