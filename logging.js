import {
  ApplicationCommandPermissionType,
  AuditLogEvent,
  AutoModerationActionType,
  EmbedBuilder,
} from "discord.js";

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
    "messageDeleteBulk",
    "memberKick",
    "memberBanAdd",
    "memberBanRemove",
    "channelPin",
    "channelUnpin",
    "channelUpdate",
  ],
  handleApplicationCommandPermissionsUpdate: async (client, db, data) => {
    let loggings = await db.getLoggings(
      data.guildId,
      "applicationCommandPermissionsUpdate".toLowerCase(),
    );
    let permissionLines = [];
    for (let permission of data.permissions) {
      let permissionType = "N/A";
      let prefix = "";
      switch (permission.type) {
        case ApplicationCommandPermissionType.Role:
          permissionType = "Role";
          prefix = "@&";
          break;
        case ApplicationCommandPermissionType.User:
          permissionType = "User";
          prefix = "@";
          break;
        case ApplicationCommandPermissionType.Channel:
          permissionType = "Channel";
          prefix = "#";
          break;
        default:
          break;
      }
      let who;
      switch (permission.id) {
        case data.guildId:
          who = "All members are";
          break;
        case data.guildId - 1:
          who = "All channels are";
          break;
        default:
          who = `<${prefix}${permission.id}> is`;
          break;
      }
      if (who == data.guildId) {
        who = "All members";
      } else if (who == data.guildId - 1) {
        who = "All channels";
      }
      permissionLines.push(
        `- ${who} ${permission.permission ? "allowed" : "not allowed"} to use this command\n`,
      );
    }
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Application Command Permissions Updated")
            .setDescription(
              `Command ${data.id} (of <@${data.applicationId}>) permissions were updated:\n\n${permissionLines.join("\n")}`,
            ),
        ],
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleAutoModerationActionExecution: async (
    client,
    db,
    autoModerationActionExecution,
  ) => {
    // TODO: Untested
    let actionType = autoModerationActionExecution.action.type.map((value) => {
      if (value == AutoModerationActionType.BlockMessage)
        return "blocked a message";
      if (value == AutoModerationActionType.SendAlertMessage)
        return "logged a message";
      if (value == AutoModerationActionType.Timeout) return "timed out a user";
      return "logged a message";
    });
    let loggings = await db.getLoggings(
      guild.id,
      "autoModerationActionExecution".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Auto Moderation Action Execution")
            .setDescription(`AutoMod ${actionType}!`),
        ],
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
        content += `### Name:\n**Before:** \`\`${oldChannel.name}\`\`\n**After:** \`\`${newChannel.name}\`\`\n`;
      }
      if (oldChannel.bitrate != newChannel.bitrate) {
        content += `### Bitrate:\n**Before:** \`\`${oldChannel.bitrate}\`\`\n**After:** \`\`${newChannel.bitrate}\`\`\n`;
      }
      if (oldChannel.nsfw != newChannel.nsfw) {
        content += `### NSFW:\n**Before:** ${oldChannel.nsfw ? "✅" : "❌"}\n**After:** ${newChannel.nsfw ? "✅" : "❌"}\n`;
      }
      if (oldChannel.parentId != newChannel.parentId) {
        content += `### Parent:\n**Before:** <#${oldChannel.parentId}> (${oldChannel.parent.name} - ${oldChannel.parentId})\n**After:** <#${newChannel.parentId}> (${newChannel.parent.name} - ${newChannel.parentId})\n`;
      }
      if (oldChannel.position != newChannel.position) {
        content += `### Position:\n\`\`${oldChannel.position}\`\` -> \`\`${newChannel.position}\`\`\n`;
      }
      if (oldChannel.topic != newChannel.topic) {
        content += `### Topic:\n**Before:** \`\`${oldChannel.topic}\`\`\n**After:** \`\`${newChannel.topic}\`\`\n`;
      }
      if (oldChannel.type != newChannel.type) {
        content += `### Type:\n**Before:** \`\`${oldChannel.type}\`\`\n**After:** \`\`${newChannel.type}\`\`\n`;
      }
      if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
        content += `### Slow-Mode:\n**Before:** \`\`${oldChannel.rateLimitPerUser} seconds\`\`\n**After:** \`\`${newChannel.rateLimitPerUser} seconds\`\`\n`;
      }
      targetChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Channel updated")
            .setDescription(
              `Channel <#${oldChannel.id}> (${newChannel.name} - ${oldChannel.id}) updated:\n${content.trim()}`,
            ),
        ],
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
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Message deleted")
            .setDescription(`Message deleted in <#${message.channel.id}>!`),
        ],
        allowed_mentions: { parse: [] },
      });
    }
  },
  handleMessageDeleteBulk: async (client, db, messages, channel) => {
    // TODO: Actually cache the data on messageCreate so I can use the old message content or author id
    let loggings = await db.getLoggings(
      channel.guild.id ?? channel.guildId,
      "messageDeleteBulk".toLowerCase(),
    );
    for (let logging of loggings) {
      let targetChannel = await client.channels.fetch(logging.targetChannel);
      targetChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Messages bulk deleted")
            .setDescription(
              `Bulk deleted ${messages.size} messages in <#${channel.id}>!`,
            ),
        ],
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
        loggings = await db.getLoggings(
          guild.id,
          "autoModerationRuleCreate".toLowerCase(),
        );
        tempdata = {};
        tempdata.target = await guild.autoModerationRules.fetch(targetId);
        tempdata.executor = await client.users.fetch(executorId);
        tempdata.actions = [];
        for (let action of tempdata.target.actions) {
          let actionType = "N/A";
          switch (action.type) {
            case AutoModerationActionType.BlockMessage:
              if (action.metadata.customMessage) {
                actionType = `Block Message with custom message: ${action.metadata.customMessage}`;
              } else {
                actionType = "Block Message";
              }
              break;
            case AutoModerationActionType.SendAlertMessage:
              let channel = await client.channels.fetch(
                action.metadata.channelId,
              );
              actionType = `Send Alert Message to <#${action.metadata.channelId}> (${channel?.name} - ${action.metadata.channelId})`;
              break;
            case AutoModerationActionType.Timeout:
              actionType = `Timeout for ${action.metadata.durationSeconds} seconds`;
              break;
            default:
              break;
          }
          tempdata.actions.push(`- ${actionType}`);
        }
        // TODO: exemptChannels, exemptRoles, triggerMetadata, triggerType
        /*tempdata.exemptChannels = [];
        for (let exemptChannel of tempdata.target.exemptChannels) {
          tempdata.exemptChannels.push(exemptChannel);
        }
        tempdata.exemptRoles = [];
        for (let exemptRole of tempdata.target.exemptRoles) {
          tempdata.exemptRoles.push(exemptRole);
        }*/
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          await targetChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("AutoMod Rule created")
                .setDescription(
                  `AutoMod Rule ${tempdata.target.name} (ID: ${targetId}) created by <@${executorId}> (${tempdata.executor?.username} - ${executorId})${tempdata.actions.length > 0 ? `, actions:\n${tempdata.actions.join("\n")}` : "!"}`,
                ),
            ],
            allowed_mentions: { parse: [] },
          });
        }
        break;
      case AuditLogEvent.AutoModerationRuleDelete:
        loggings = await db.getLoggings(
          guild.id,
          "autoModerationRuleDelete".toLowerCase(),
        );
        tempdata = {};
        tempdata.executor = await client.users.fetch(executorId);
        for (let logging of loggings) {
          let targetChannel = await client.channels.fetch(
            logging.targetChannel,
          );
          await targetChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("AutoMod Rule deleted")
                .setDescription(
                  `AutoMod Rule ${targetId} deleted by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
            allowed_mentions: { parse: [] },
          });
        }
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Channel created")
                .setDescription(
                  `Channel <#${targetId}> (${tempdata.target?.name} - ${targetId}) created by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Channel deleted")
                .setDescription(
                  `Channel <#${targetId}> (${tempdata.target?.name ?? "N/A"} - ${targetId}) deleted by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Member banned")
                .setDescription(
                  `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) banned by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Member unbanned")
                .setDescription(
                  `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) unbanned by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Member disconnected")
                .setDescription(
                  `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) disconnected by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Member kicked")
                .setDescription(
                  `Member <@${targetId}> (${tempdata.target?.username ?? "N/A"} - ${targetId}) kicked by <@${executorId}> (${tempdata.executor?.username} - ${executorId})!`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Message pinned")
                .setDescription(
                  `Message by <@${targetId}> in channel <#${extra.channel.id}> (${extra.channel.name} - ${extra.channel.id}) pinned by <@${executorId}>! [Jump to Message](https://discord.com/channels/${extra.channel.guildId}/${extra.channel.id}/${extra.messageId})`,
                ),
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Message unpinned")
                .setDescription(
                  `Message by <@${targetId}> in channel <#${extra.channel.id}> (${extra.channel.name} - ${extra.channel.id}) unpinned by <@${executorId}>! [Jump to Message](https://discord.com/channels/${extra.channel.guildId}/${extra.channel.id}/${extra.messageId})`,
                ),
            ],
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
