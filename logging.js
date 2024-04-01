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
    "messageDelete",
    "memberKick",
    "memberBanAdd",
    "memberBanRemove",
    "channelPin",
    "channelUnpin",
    "channelUpdate",
  ],
  handleApplicationCommandPermissionsUpdate: async (client, db, data) => {
    let loggings = await db.getLoggings(
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
    let loggings = await db.getLoggings(
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
    let loggings = await db.getLoggings(
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
    let loggings = await db.getLoggings(
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
    let loggings = await db.getLoggings(
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
  handleChannelUpdate: async (client, db, oldChannel, newChannel) => {
    let loggings = await db.getLoggings(
      newChannel.guildId,
      "channelUpdate".toLowerCase(),
    );
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
  handleMessageDelete: async (client, db, message) => {
    // TODO: Actually cache the data on messageCreate so I can use the old message content or author id
    let loggings = await db.getLoggings(
      message.guild.id,
      "messageDelete".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        content: `Message deleted in <#${message.channel.id}>`,
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleGuildAuditLogEntryCreate: async (client, db, auditLogEntry, guild) => {
    const { action, extra, executorId, targetId } = auditLogEntry;
    let loggings = null;
    let tempdata = null;
    console.log("extra:" + JSON.stringify(extra));
    console.log("executorId:" + JSON.stringify(executorId));
    console.log("targetId:" + JSON.stringify(targetId));
    switch (action) {
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
        loggings = await db.getLoggings(
          guild.id,
          "channelCreate".toLowerCase(),
        );
        tempdata = {};
        tempdata.target = await client.channels.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Channel <#${targetId}> (${tempdata.target?.name} - ${targetId}) created by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.ChannelDelete:
        loggings = await db.getLoggings(
          guild.id,
          "channelDelete".toLowerCase(),
        );
        tempdata = {};
        tempdata.target = await client.channels.cache.get(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Channel <#${targetId}> (${tempdata.target?.name ?? "N/A"} - ${targetId}) deleted by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
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
        loggings = await db.getLoggings(guild.id, "memberBanAdd".toLowerCase());
        tempdata = {};
        tempdata.target = await client.users.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) banned by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.MemberBanRemove:
        loggings = await db.getLoggings(
          guild.id,
          "memberBanRemove".toLowerCase(),
        );
        tempdata = {};
        tempdata.target = await client.users.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) unbanned by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.MemberDisconnect:
        loggings = await db.getLoggings(
          guild.id,
          "memberDisconnect".toLowerCase(),
        );
        tempdata = {};
        tempdata.target = await client.users.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) disconnected by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.MemberKick:
        loggings = await db.getLoggings(guild.id, "memberKick".toLowerCase());
        tempdata = {};
        tempdata.target = await client.users.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) kicked by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
            allowed_mentions: { parse: [] },
          });
        }
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
        // Works only when the message has been deleted by someone other than the author and even then only gets sent once even when multiple messages were deleted
        break;
      case AuditLogEvent.MessagePin:
        loggings = await db.getLoggings(guild.id, "channelPin".toLowerCase());
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Message by <@${targetId}> in channel <#${extra.channel.id}> (${extra.channel.name} - ${extra.channel.id}) pinned by <@${executorId}>! [Jump to Message](https://discord.com/channels/${extra.channel.guildId}/${extra.channel.id}/${extra.messageId})`,
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.MessageUnpin:
        loggings = await db.getLoggings(guild.id, "channelUnpin".toLowerCase());
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          targetChannel.send({
            content: `Message by <@${targetId}> in channel <#${extra.channel.id}> (${extra.channel.name} - ${extra.channel.id}) unpinned by <@${executorId}>! [Jump to Message](https://discord.com/channels/${extra.channel.guildId}/${extra.channel.id}/${extra.messageId})`,
            allowed_mentions: { parse: [] },
          });
        }
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
