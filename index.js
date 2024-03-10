import "dotenv/config";

import {
  AuditLogEvent,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { moderateBot, moderateUser } from "./moderation.js";
import {
  handleMessageCommands,
  handleApplicationCommands,
  getDatabase,
} from "./commands.js";
import { runWorkers } from "./background-worker/background-worker.js";

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping, // Probably not needed and removed later
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping, // Probably not needed and removed later
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

client.on(Events.GuildAuditLogEntryCreate, (auditLogEntry, guild) => {
  switch (auditLogEntry.action) {
    case AuditLogEvent.ApplicationCommandPermissionUpdate:
      break;
    case AuditLogEvent.AutoModerationBlockMessage:
      break;
    case AuditLogEvent.AutoModerationFlagToChannel:
      break;
    case AuditLogEvent.AutoModerationRuleCreate:
      break;
    case AuditLogEvent.AutoModerationRuleDelete:
      break;
    case AuditLogEvent.AutoModerationRuleUpdate:
      break;
    case AuditLogEvent.AutoModerationUserCommunicationDisabled:
      break;
    case AuditLogEvent.BotAdd:
      break;
    case AuditLogEvent.ChannelCreate:
      break;
    case AuditLogEvent.ChannelDelete:
      break;
    case AuditLogEvent.ChannelOverwriteCreate:
      break;
    case AuditLogEvent.ChannelOverwriteDelete:
      break;
    case AuditLogEvent.ChannelOverwriteUpdate:
      break;
    case AuditLogEvent.ChannelUpdate:
      break;
    case AuditLogEvent.CreatorMonetizationRequestCreated:
      break;
    case AuditLogEvent.CreatorMonetizationTermsAccepted:
      break;
    case AuditLogEvent.EmojiCreate:
      break;
    case AuditLogEvent.EmojiDelete:
      break;
    case AuditLogEvent.EmojiUpdate:
      break;
    case AuditLogEvent.GuildScheduledEventCreate:
      break;
    case AuditLogEvent.GuildScheduledEventDelete:
      break;
    case AuditLogEvent.GuildScheduledEventUpdate:
      break;
    case AuditLogEvent.GuildUpdate:
      break;
    case AuditLogEvent.IntegrationCreate:
      break;
    case AuditLogEvent.IntegrationDelete:
      break;
    case AuditLogEvent.IntegrationUpdate:
      break;
    case AuditLogEvent.InviteCreate:
      break;
    case AuditLogEvent.MemberBanAdd:
      break;
    case AuditLogEvent.MemberBanRemove:
      break;
    case AuditLogEvent.MemberDisconnect:
      break;
    case AuditLogEvent.MemberKick:
      break;
    case AuditLogEvent.MemberMove:
      break;
    case AuditLogEvent.MemberPrune:
      break;
    case AuditLogEvent.MemberRoleUpdate:
      break;
    case AuditLogEvent.MemberUpdate:
      break;
    case AuditLogEvent.MessageBulkDelete:
      break;
    case AuditLogEvent.MessageDelete:
      break;
    case AuditLogEvent.MessagePin:
      break;
    case AuditLogEvent.MessageUnpin:
      break;
    case AuditLogEvent.RoleCreate:
      break;
    case AuditLogEvent.RoleDelete:
      break;
    case AuditLogEvent.RoleUpdate:
      break;
    case AuditLogEvent.StageInstanceCreate:
      break;
    case AuditLogEvent.StageInstanceDelete:
      break;
    case AuditLogEvent.StageInstanceUpdate:
      break;
    case AuditLogEvent.StickerCreate:
      break;
    case AuditLogEvent.StickerDelete:
      break;
    case AuditLogEvent.StickerUpdate:
      break;
    case AuditLogEvent.ThreadCreate:
      break;
    case AuditLogEvent.ThreadDelete:
      break;
    case AuditLogEvent.ThreadUpdate:
      break;
    case AuditLogEvent.WebhookCreate:
      break;
    case AuditLogEvent.WebhookDelete:
      break;
    case AuditLogEvent.WebhookUpdate:
      break;
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.log(
    "DISCORD_TOKEN not found! You must specify your Discord bot token as DISCORD_TOKEN environment variable or put it in a `.env` file.",
  );
} else {
  client.login(process.env.DISCORD_TOKEN);
}
