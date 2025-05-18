// Discord Bot with DigitalOcean AI Agent API Integration
// This bot will respond to direct mentions and the /ask slash command

import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Message,
  TextChannel,
  Events,
  OAuth2Scopes,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import axios from "axios";

// Initialize Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Interface for DigitalOcean AI API response
interface DOAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

/**
 * Function to interact with DigitalOcean AI Agent API
 * @param prompt The user prompt to send to the AI
 * @returns AI response as a string
 */
async function askDigitalOceanAI(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${process.env.DO_AI_AGENT_ENDPOINT}/api/v1/chat/completions`,
      JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        stream: false,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DO_AI_API_KEY}`,
        },
      }
    );

    if (response.status == 200) {
      const data: DOAIResponse = response.data;

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else if (data.error) {
        return `Error: ${data.error.message}`;
      }
    }

    return "";
  } catch (error) {
    console.error("Error querying DigitalOcean AI:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
}

/**
 * Register slash commands with Discord API
 */
async function registerCommands(): Promise<void> {
  const commands = [
    new SlashCommandBuilder()
      .setName("ask")
      .setDescription("Ask the DigitalOcean AI Agent a question")
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("Your question for the AI")
          .setRequired(true)
      )
      .toJSON(),
    new ContextMenuCommandBuilder()
      .setName("Ask AI")
      .setType(ApplicationCommandType.Message)
      .toJSON(),
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
}

/**
 * Split a long message into chunks that fit within Discord's message limit
 * @param text The message to split
 * @param maxLength Maximum length of each chunk
 * @returns Array of message chunks
 */
function splitMessage(text: string, maxLength: number = 2000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by newlines first to try to keep paragraphs together
  const lines = text.split("\n");

  for (const line of lines) {
    // If adding this line would exceed max length, push current chunk and start a new one
    if (currentChunk.length + line.length + 1 > maxLength) {
      // If the current line itself is too long, split it
      if (line.length > maxLength) {
        // If we have content in the current chunk, push it first
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = "";
        }

        // Split the long line into multiple chunks
        let remainingLine = line;
        while (remainingLine.length > 0) {
          const chunkSize = Math.min(maxLength, remainingLine.length);
          chunks.push(remainingLine.substring(0, chunkSize));
          remainingLine = remainingLine.substring(chunkSize);
        }
      } else {
        // Just push the current chunk and start a new one with this line
        chunks.push(currentChunk);
        currentChunk = line;
      }
    } else {
      // Add the line to the current chunk
      if (currentChunk.length > 0) {
        currentChunk += "\n";
      }
      currentChunk += line;
    }
  }

  // Don't forget to push the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Handle when the bot is ready
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity("helping you!");

  const inviteLink = client.generateInvite({
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    permissions: ["Administrator"],
  });

  console.log(`Invite me to your server with this link: ${inviteLink}`);

  registerCommands();
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ask") {
    // Defer reply as AI might take some time to respond
    await interaction.deferReply();

    const question = (
      interaction as ChatInputCommandInteraction
    ).options.getString("question");
    if (!question) {
      await interaction.editReply("Please provide a question.");
      return;
    }

    console.log(`Slash command request: ${question}`);

    try {
      const response = await askDigitalOceanAI(question);
      const responseChunks = splitMessage(response);

      // Send the first chunk as the main reply
      await interaction.editReply(responseChunks[0]);

      // Send any additional chunks as follow-ups
      for (let i = 1; i < responseChunks.length; i++) {
        await interaction.followUp(responseChunks[i]);
      }
    } catch (error) {
      console.error("Error handling slash command:", error);
      await interaction.editReply(
        "Sorry, something went wrong while processing your request."
      );
    }
  }
});

// Handle contextual menu commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isMessageContextMenuCommand()) return;

  if (interaction.commandName === "Ask AI") {
    // Defer reply as AI might take some time to respond
    await interaction.deferReply();

    const message = (interaction as MessageContextMenuCommandInteraction)
      .targetMessage;

    console.log(`Contextual command request: ${message.content}`);

    try {
      const response = await askDigitalOceanAI(message.content);
      const responseChunks = splitMessage(response);

      // Send the first chunk as the main reply
      await interaction.editReply(responseChunks[0]);

      // Send any additional chunks as follow-ups
      for (let i = 1; i < responseChunks.length; i++) {
        await interaction.followUp(responseChunks[i]);
      }
    } catch (error) {
      console.error("Error handling slash command:", error);
      await interaction.editReply(
        "Sorry, something went wrong while processing your request."
      );
    }
  }
});

// Handle message mentions
client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore messages from bots to prevent potential loops
  if (message.author.bot) return;

  // Check if the message mentions the bot
  if (message.mentions.has(client.user!.id)) {
    // Remove the mention from the message content to get just the question
    const content = message.content.replace(/<@!?(\d+)>/g, "").trim();

    if (!content) {
      await message.reply(
        "Hello! Ask me something by mentioning me followed by your question, or use the `/ask` command."
      );
      return;
    }

    console.log(`Direct mention request: ${content}`);

    // Show typing indicator while processing
    const channel = message.channel as TextChannel;
    channel.sendTyping();

    try {
      const response = await askDigitalOceanAI(content);
      const responseChunks = splitMessage(response);

      // Send each chunk as a separate reply
      for (const chunk of responseChunks) {
        await message.reply(chunk);
      }
    } catch (error) {
      console.error("Error handling mention:", error);
      await message.reply(
        "Sorry, something went wrong while processing your request."
      );
    }
  }
});

// Error handling
client.on(Events.Error, (error: Error) => {
  console.error("Discord client error:", error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
