import "dotenv/config";

import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { moderateBot, moderateUser } from "./moderation.js";
import {
  handleMessageCommands,
  handleApplicationCommands,
  getDatabase,
} from "./commands.js";
import { runWorkers } from "./background-worker/background-worker.js";
import Logging from "./logging.js";

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  let db = getDatabase();
  db.initDb();
  runWorkers(client, db);
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) {
    await moderateBot(msg);
  } else {
    let moderated = await moderateUser(msg);
    if (!moderated) {
      await handleMessageCommands(msg);
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  await handleApplicationCommands(interaction);
});

client.on(Events.ApplicationCommandPermissionsUpdate, async (data) => {
  await Logging.handleApplicationCommandPermissionsUpdate(
    client,
    getDatabase(),
    data,
  );
});

client.on(
  Events.AutoModerationActionExecution,
  async (autoModerationActionExecution) => {
    await Logging.handleAutoModerationActionExecution(
      client,
      getDatabase(),
      autoModerationActionExecution,
    );
  },
);

client.on(
  Events.AutoModerationRuleUpdate,
  async (oldAutoModerationRule, newAutoModerationRule) => {
    await Logging.handleAutoModerationRuleUpdate(
      client,
      getDatabase(),
      oldAutoModerationRule,
      newAutoModerationRule,
    );
  },
);

client.on(Events.MessageDelete, async (message) => {
  if (!message.guild || !message.guildId) return;
  await Logging.handleMessageDelete(client, getDatabase(), message);
});

client.on(Events.MessageBulkDelete, async (messages, channel) => {
  if (!channel.guild || !channel.guildId) return;
  await Logging.handleMessageDeleteBulk(
    client,
    getDatabase(),
    messages,
    channel,
  );
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
  if (oldChannel.isDMBased() || newChannel.isDMBased()) return;
  await Logging.handleChannelUpdate(
    client,
    getDatabase(),
    oldChannel,
    newChannel,
  );
});

client.on(Events.GuildAuditLogEntryCreate, async (auditLogEntry, guild) => {
  await Logging.handleGuildAuditLogEntryCreate(
    client,
    getDatabase(),
    auditLogEntry,
    guild,
  );
});

if (!process.env.DISCORD_TOKEN) {
  console.log(
    "DISCORD_TOKEN not found! You must specify your Discord bot token as DISCORD_TOKEN environment variable or put it in a `.env` file.",
  );
} else {
  client.login(process.env.DISCORD_TOKEN);
}
