# Discord Bot with DigitalOcean AI Agent API Integration

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/dowmeister/digitalocean-ai-agent-discord-bot/tree/main&refcode=02408030ecae)

This Discord bot responds to direct mentions and the `/ask` slash command by connecting to the DigitalOcean AI Agent API and an attached Knowledge Baee.

## Prerequisites

- Node.js (v16.9.0 or higher)
- A Discord account and a registered Discord application/bot
- A DigitalOcean account with AI Agent API access

## Setup Instructions

### 1. Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "Bot" tab and click "Add Bot"
4. Under the "Privileged Gateway Intents" section, enable:
   - Server Members Intent
   - Message Content Intent
5. Save your changes
6. Copy your bot token (you'll need this for the `.env` file)

### 2. Enable Slash Commands

1. In the Discord Developer Portal, go to the "OAuth2" tab
2. In the "URL Generator" section, select the following scopes:
   - `bot`
   - `applications.commands`
3. Under "Bot Permissions", select:
   - Read Messages/View Channels
   - Send Messages
   - Read Message History
   - Use Slash Commands
   - Add Reactions
4. Copy the generated URL and open it in your browser to add the bot to your server

### 3. DigitalOcean AI Agent API Setup

1. Log in to your DigitalOcean account
2. Navigate to the AI section and create or select an AI Agent
3. Generate an API key if you don't already have one
4. Make note of your AI Agent ID and API key

### 4. Project Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root directory using the template provided in the repository
4. Fill in your environment variables:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `DISCORD_CLIENT_ID`: Your Discord application ID
   - `DO_AI_API_KEY`: Your DigitalOcean API key
   - `DO_AI_AGENT_ENDPOINT`: Your DigitalOcean AI Agent Endpoint URL

### 5. Run the Bot

```bash
npm run dev
```

## Usage

The bot responds to two types of interactions:

1. **Direct Mentions**: Tag the bot and ask a question

   ```
   @YourBotName Can you help me?
   ```

2. **Slash Command**: Use the `/ask` command followed by your question
   ```
   /ask Can you help me?
   ```

## Features

- Responds to direct mentions and slash commands
- Handles long responses by splitting them into multiple messages
- Basic error handling and logging
- Shows typing indicator while processing requests

## Troubleshooting

- If the bot doesn't respond to slash commands, make sure you've properly registered the commands and added the bot to your server with the right permissions.
- Check the console logs for any error messages.
- Verify that all environment variables are correctly set in the `.env` file.
- Ensure your DigitalOcean AI Agent API key has the proper permissions.

## Additional Resources

- [Discord.js Documentation](https://discord.js.org/)
- [DigitalOcean API Documentation](https://docs.digitalocean.com/reference/api/)

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=02408030ecae&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
