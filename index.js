import "dotenv/config";

import {
  AuditLogEvent,
  AutoModerationActionType,
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

client.on(Events.ApplicationCommandPermissionsUpdate, async (data) => {
  let loggings = getDatabase().getLoggings(
    guild.id,
    "ApplicationCommandPermissionUpdate",
  );
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `<@${data.applicationId}>'s application commands were updated!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(
  Events.AutoModerationActionExecution,
  async (autoModerationActionExecution) => {
    let loggings = getDatabase().getLoggings(
      guild.id,
      "AutoModerationActionExecution",
    );
    for (let logging of loggings) {
      let destinationChannel = await client.channels.fetch(
        logging.destinationChannel,
      );
      let actionType = autoModerationActionExecution.action.type.map(
        (value) => {
          if (value == AutoModerationActionType.BlockMessage)
            return "blocked a message";
          if (value == AutoModerationActionType.SendAlertMessage)
            return "logged a message";
          if (value == AutoModerationActionType.Timeout)
            return "timed out a user";
          return "logged a message";
        },
      );
      destinationChannel.send({
        content: `AutoMod ${actionType}!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
);

client.on(Events.AutoModerationRuleCreate, async (autoModerationRule) => {
  let loggings = getDatabase().getLoggings(
    guild.id,
    "AutoModerationRuleCreate",
  );
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `AutoMod Rule ${autoModerationRule.name} created by <@${autoModerationRule.creatorId}>!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(Events.AutoModerationRuleDelete, async (autoModerationRule) => {
  let loggings = getDatabase().getLoggings(
    guild.id,
    "AutoModerationRuleDelete",
  );
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `AutoMod Rule ${autoModerationRule.name} deleted (created by <@${autoModerationRule.creatorId}>)!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(
  Events.AutoModerationRuleUpdate,
  async (oldAutoModerationRule, newAutoModerationRule) => {
    let loggings = getDatabase().getLoggings(
      guild.id,
      "AutoModerationRuleUpdate",
    );
    for (let logging of loggings) {
      let destinationChannel = await client.channels.fetch(
        logging.destinationChannel,
      );
      let content = "";
      if (oldAutoModerationRule) {
        for (let oldAction of oldAutoModerationRule.actions) {
          for (let newAction of newAutoModerationRule.actions) {
            if (oldAction.metadata.channelId != newAction.metadata.channelId) {
              content += `Channel:\nBefore: <#${oldAction.metadata.channelId}>\nAfter: <#${newAction.metadata.channelId}>\n`;
            }
            if (
              oldAction.metadata.customMessage !=
              newAction.metadata.customMessage
            ) {
              content += `Custom Message:\nBefore: \`${oldAction.metadata.customMessage}\`\nAfter: \`${newAction.metadata.customMessage}\`\n`;
            }
            if (
              oldAction.metadata.durationSeconds !=
              newAction.metadata.durationSeconds
            ) {
              content += `Duration:\nBefore: \`${oldAction.metadata.durationSeconds} seconds\`\nAfter: \`${newAction.metadata.durationSeconds} seconds\`\n`;
            }
            if (oldAction.type != newAction.type) {
              let oldType = "N/A";
              switch (oldAction.type) {
                case AutoModerationActionType.BlockMessage:
                  oldType = "Block Message";
                  break;
                case AutoModerationActionType.SendAlertMessage:
                  oldType = "Send Alert Message";
                  break;
                case AutoModerationActionType.Timeout:
                  oldType = "Timeout";
                  break;
              }
              let newType = "N/A";
              switch (newAction.type) {
                case AutoModerationActionType.BlockMessage:
                  newType = "Block Message";
                  break;
                case AutoModerationActionType.SendAlertMessage:
                  newType = "Send Alert Message";
                  break;
                case AutoModerationActionType.Timeout:
                  newType = "Timeout";
                  break;
              }
              content += `Type:\nBefore: \`${oldType}\`\nAfter: \`${newType}\`\n`;
            }
          }
        }
      }
      destinationChannel.send({
        content: `AutoMod Rule updated (created by <@${newAutoModerationRule.creatorId}>):\n${content}`,
        allowed_mentions: { parse: [] },
      });
    }
  },
);

client.on(Events.ChannelCreate, async (channel) => {
  let loggings = getDatabase().getLoggings(guild.id, "ChannelCreate");
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `Channel <#${channel.id}> (${channel.name} - ${channel.id}) created!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(Events.ChannelDelete, async (channel) => {
  if (channel.isDMBased()) return; // Doesn't make sense in DMs
  let loggings = getDatabase().getLoggings(guild.id, "ChannelDelete");
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `Channel <#${channel.id}> (${channel.name} - ${channel.id}) deleted!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(Events.ChannelPinsUpdate, async (channel, time) => {
  let loggings = getDatabase().getLoggings(guild.id, "ChannelPinsUpdate");
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    destinationChannel.send({
      content: `Pins of Channel <#${channel.id}> (${channel.name} - ${channel.id}) updated!`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
  if (oldChannel.isDMBased()) return; // Doesn't make sense in DMs
  if (newChannel.isDMBased()) return; // Doesn't make sense in DMs
  let loggings = getDatabase().getLoggings(guild.id, "ChannelUpdate");
  for (let logging of loggings) {
    let destinationChannel = await client.channels.fetch(
      logging.destinationChannel,
    );
    let content = "";
    if (oldChannel.name != newChannel.name) {
      content += `Name:\nBefore: ${oldChannel.name}\nAfter: ${newChannel.name}\n`;
    }
    if (oldChannel.bitrate != newChannel.bitrate) {
      content += `Bitrate:\nBefore: \`${oldChannel.bitrate}\`\nAfter: \`${newChannel.bitrate}\`\n`;
    }
    if (oldChannel.nsfw != newChannel.nsfw) {
      content += `NSFW:\nBefore: \`${oldChannel.nsfw}\`\nAfter: \`${newChannel.nsfw}\`\n`;
    }
    if (oldChannel.parentId != newChannel.parentId) {
      content += `Parent:\nBefore: <#${oldChannel.parentId}> (${oldChannel.parent.name} - ${oldChannel.parentId})\nAfter: <#${newChannel.parentId}> (${newChannel.parent.name} - ${newChannel.parentId})\n`;
    }
    if (oldChannel.position != newChannel.position) {
      content += `Position: ${oldChannel.position}> -> ${newChannel.position}\n`;
    }
    if (oldChannel.topic != newChannel.topic) {
      content += `Topic:\nBefore: \`${oldChannel.topic}\`\nAfter: ${newChannel.topic})\n`;
    }
    if (oldChannel.type != newChannel.type) {
      content += `Type:\nBefore: \`${oldChannel.type}\`\nAfter: ${newChannel.type})\n`;
    }
    destinationChannel.send({
      content: `Channel <#${oldChannel.id}> (${newChannel.name} - ${oldChannel.id}) updated:`,
      allowed_mentions: { parse: [] },
    });
  }
});

client.on(Events.GuildAuditLogEntryCreate, async (auditLogEntry, guild) => {
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
