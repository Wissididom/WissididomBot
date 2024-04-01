import { AuditLogEvent, AutoModerationActionType } from "discord.js";

let exportObj = {
  availableLoggingEvents: [
    "applicationCommandPermissionsUpdate",
    "autoModerationActionExecution",
    "autoModerationRuleCreate",
    "autoModerationRuleDelete",
    "autoModerationRuleUpdate",
    "channelCreate",
    "channelDelete",
    "channelPinsUpdate",
    "channelUpdate",
  ],
  handleApplicationCommandPermissionsUpdate: async (client, db, data) => {
    let loggings = db.getLoggings(
      guild.id,
      "applicationCommandPermissionUpdate".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `<@${data.applicationId}>'s application commands were updated!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleAutoModerationActionExecution: async (
    client,
    db,
    autoModerationActionExecution,
  ) => {
    let loggings = db.getLoggings(
      guild.id,
      "autoModerationActionExecution".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
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
      targetChannel.send({
        content: `AutoMod ${actionType}!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleAutoModerationRuleCreate: async (client, db, autoModerationRule) => {
    let loggings = db.getLoggings(
      guild.id,
      "autoModerationRuleCreate".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `AutoMod Rule ${autoModerationRule.name} created by <@${autoModerationRule.creatorId}>!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleAutoModerationRuleDelete: async (client, db, autoModerationRule) => {
    let loggings = db.getLoggings(
      guild.id,
      "autoModerationRuleDelete".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `AutoMod Rule ${autoModerationRule.name} deleted (created by <@${autoModerationRule.creatorId}>)!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleAutoModerationRuleUpdate: async (
    client,
    db,
    oldAutoModerationRule,
    newAutoModerationRule,
  ) => {
    let loggings = db.getLoggings(
      guild.id,
      "autoModerationRuleUpdate".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
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
      targetChannel.send({
        content: `AutoMod Rule updated (created by <@${newAutoModerationRule.creatorId}>):\n${content}`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleChannelCreate: async (client, db, channel) => {
    let loggings = db.getLoggings(guild.id, "channelCreate".toLowerCase());
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `Channel <#${channel.id}> (${channel.name} - ${channel.id}) created!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleChannelDelete: async (client, db, channel) => {
    let loggings = db.getLoggings(guild.id, "channelDelete".toLowerCase());
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `Channel <#${channel.id}> (${channel.name} - ${channel.id}) deleted!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleChannelPinsUpdate: async (client, db, channel, time) => {
    let loggings = db.getLoggings(guild.id, "channelPinsUpdate".toLowerCase());
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `Pins of Channel <#${channel.id}> (${channel.name} - ${channel.id}) updated!`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleChannelUpdate: async (client, db, oldChannel, newChannel) => {
    let loggings = db.getLoggings(guild.id, "channelUpdate".toLowerCase());
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
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
      targetChannel.send({
        content: `Channel <#${oldChannel.id}> (${newChannel.name} - ${oldChannel.id}) updated:`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleGuildAuditLogEntryCreate: async (client, db, auditLogEntry, guild) => {
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
  },
};

export default exportObj;
