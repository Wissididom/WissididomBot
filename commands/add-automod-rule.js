const {
  PermissionsBitField,
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerType,
  AutoModerationRuleKeywordPresetType,
  AutoModerationActionType,
  SlashCommandBuilder,
} = require("discord.js");
const { getComplexArgsFromMessage } = require("../util");

module.exports = {
  name: "add-automod-rule",
  description: "Adds an automod rule to the current server",
  permissions: [
    PermissionsBitField.Flags.Administrator,
    PermissionsBitField.Flags.ManageGuild,
  ],
  registerObject: new SlashCommandBuilder()
    .setName("add-automod-rule")
    .setDescription("Adds a new AutoMod rule to the Discord Server")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the new AutoMod rule")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("eventtype")
        .setDescription("The event type of the new AutoMod rule")
        .setRequired(true)
        .addChoices({ name: "MessageSend", value: "messagesend" }),
    )
    .addStringOption((option) =>
      option
        .setName("triggertype")
        .setDescription("The trigger type of the new AutoMod rule")
        .setRequired(true)
        .addChoices(
          { name: "Keyword", value: "keyword" },
          { name: "KeywordPreset", value: "keywordpreset" },
          { name: "MentionSpam", value: "mentionspam" },
          { name: "Spam", value: "spam" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("keywordfilter")
        .setDescription(
          "The keyword filters of the new AutoMod rule, separated by `;`",
        ),
    )
    .addStringOption((option) =>
      option
        .setName("regexpattern")
        .setDescription(
          "The regex pattern of the new AutoMod rule, separated by `;`",
        ),
    )
    .addStringOption((option) =>
      option
        .setName("presets")
        .setDescription(
          "The presets of the new AutoMod rule, separated by `;`",
        ),
    )
    .addStringOption((option) =>
      option
        .setName("allowlist")
        .setDescription(
          "a list of strings to be exempt from triggering, separated by `;`",
        ),
    )
    .addIntegerOption((option) =>
      option
        .setName("mentiontotallimit")
        .setDescription("the total number of mentions allowed per message"),
    )
    .addBooleanOption((option) =>
      option
        .setName("mentiontotallimitraidprotectionenabled")
        .setDescription("Whether to automatically detect mention raids"),
    ),
  runMessage: async (prefix, msg) => {
    if (msg.guild.available) {
      let autoModerationRuleManager = msg.guild.autoModerationRules;
      let args = getComplexArgsFromMessage(msg);
      let name = args.name;
      if (!name) {
        await msg.reply({
          content: `You must specify a name for the AutoMod Rule! You specified: ${name}`,
        });
        return;
      }
      let eventType = null;
      let eventTypeStr = args.eventtype;
      if (!eventTypeStr) {
        await msg.reply({
          content: `You must specify an event type for the AutoMod Rule! You specified: ${eventTypeStr}`,
        });
        return;
      }
      switch (eventTypeStr) {
        case "messagesend":
          eventType = AutoModerationRuleEventType.MessageSend;
          break;
        default:
          await msg.reply({
            content: `The given event type (${eventTypeStr}) does not exist! Please use \`MessageSend\``,
          });
          return;
      }
      let triggerType = null;
      let triggerTypeStr = args.triggertype;
      if (!triggerTypeStr) {
        await msg.reply({
          content: `You must specify an trigger type for the AutoMod Rule! You specified: ${triggerTypeStr}`,
        });
        return;
      }
      switch (triggerTypeStr) {
        case "keyword":
          triggerType = AutoModerationRuleTriggerType.Keyword;
          break;
        case "keywordpreset":
          triggerType = AutoModerationRuleTriggerType.KeywordPreset;
          break;
        case "mentionspam":
          triggerType = AutoModerationRuleTriggerType.MentionSpam;
          break;
        case "spam":
          triggerType = AutoModerationRuleTriggerType.Spam;
          break;
        default:
          await msg.reply({
            content: `The given trigger type (${triggerTypeStr}) does not exist! Please use either \`Keyword\`, \`KeywordPreset\`, \`MentionSpam\` or \`Spam\``,
          });
          return;
      }
      let triggerMetadata = {
        keywordFilter: args.keywordfilter.split(";"),
        regexPatterns: args.regexpatterns.split(";"),
        presets: args.presets.split(";").forEach((preset) => {
          switch (preset.toLowerCase()) {
            case "profanity":
              return AutoModerationRuleKeywordPresetType.Profanity;
            case "sexualcontent":
              return AutoModerationRuleKeywordPresetType.SexualContent;
            case "slurs":
              return AutoModerationRuleKeywordPresetType.Slurs;
            default:
              return null;
          }
        }),
        allowList: args.allowlist.split(";"),
        mentionTotalLimit: parseInt(args.mentiontotallimit, 10),
        mentionRaidProtectionEnabled:
          args.mentionraidprotectionenabled.toLowerCase() == "true",
      };
      let actions = args.actions.split(";").forEach((action) => {
        let splitted = action.split(":");
        if (splitted.length < 1) return null;
        let actionType = null;
        let actionTypeStr = splitted[0].toLowerCase();
        switch (actionTypeStr) {
          case "blockmessage":
            actionType = AutoModerationActionType.BlockMessage;
            break;
          case "sendalertmessage":
            actionType = AutoModerationActionType.SendAlertMessage;
            break;
          case "timeout":
            actionType = AutoModerationActionType.Timeout;
            break;
          default:
            return null;
        }
        if (splitted.length < 2) {
          return {
            type: actionType,
          };
        }
        let actionMetadataSplitted = splitted[1].split("|");
        let actionMetadata = {
          channel: actionMetadataSplitted[0],
          durationSeconds: parseInt(actionMetadataSplitted[1]),
          customMessage: actionMetadataSplitted[2],
        };
        return {
          type: actionType,
          metadata: actionMetadata,
        };
      });
      let enabled = args.enabled.toLowerCase() == "true";
      let exemptRoles = args.exemptroles.split(";");
      let exemptChannels = args.exemptchannels.split(";");
      let reason = `${prefix}${this.name} command executed by ${msg.author.username}`;
      await autoModerationRuleManager.create({
        name,
        eventType,
        triggerType,
        triggerMetadata,
        actions,
        enabled,
        exemptRoles,
        exemptChannels,
        reason,
      });
    }
  },
  runInteraction: async (interaction) => {
    if (interaction.guild.available) {
      let autoModerationRuleManager = interaction.guild.autoModerationRules;
      let name = interaction.options.getString("name");
      let eventType = null;
      let eventTypeStr = interaction.options.getString("eventtype");
      switch (eventTypeStr) {
        case "messagesend":
          eventType = AutoModerationRuleEventType.MessageSend;
          break;
        default:
          await msg.reply({
            content: `The given event type (${eventTypeStr}) does not exist! Please use \`MessageSend\``,
          });
          return;
      }
      let triggerType = null;
      let triggerTypeStr = interaction.options.getString("triggertype");
      switch (triggerTypeStr) {
        case "keyword":
          triggerType = AutoModerationRuleTriggerType.Keyword;
          break;
        case "keywordpreset":
          triggerType = AutoModerationRuleTriggerType.KeywordPreset;
          break;
        case "mentionspam":
          triggerType = AutoModerationRuleTriggerType.MentionSpam;
          break;
        case "spam":
          triggerType = AutoModerationRuleTriggerType.Spam;
          break;
        default:
          await msg.reply({
            content: `The given trigger type (${triggerTypeStr}) does not exist! Please use either \`Keyword\`, \`KeywordPreset\`, \`MentionSpam\` or \`Spam\``,
          });
          return;
      }
      let triggerMetadata = {
        keywordFilter: interaction.options
          .getString("keywordfilter")
          .split(";"),
        regexPatterns: interaction.options
          .getString("regexpatterns")
          .split(";"),
        presets: interaction.options
          .getString("presets")
          .split(";")
          .forEach((preset) => {
            switch (preset.toLowerCase()) {
              case "profanity":
                return AutoModerationRuleKeywordPresetType.Profanity;
              case "sexualcontent":
                return AutoModerationRuleKeywordPresetType.SexualContent;
              case "slurs":
                return AutoModerationRuleKeywordPresetType.Slurs;
              default:
                return null;
            }
          }),
        allowList: interaction.options.getString("allowlist").split(";"),
        mentionTotalLimit: interaction.options.getInteger("mentiontotallimit"),
        mentionRaidProtectionEnabled: interaction.options.getBoolean(
          "mentionraidprotectionenabled",
        ),
      };
      let actions = interaction.options
        .getString("actions")
        .split(";")
        .forEach((action) => {
          let splitted = action.split(":");
          if (splitted.length < 1) return null;
          let actionType = null;
          let actionTypeStr = splitted[0].toLowerCase();
          switch (actionTypeStr) {
            case "blockmessage":
              actionType = AutoModerationActionType.BlockMessage;
              break;
            case "sendalertmessage":
              actionType = AutoModerationActionType.SendAlertMessage;
              break;
            case "timeout":
              actionType = AutoModerationActionType.Timeout;
              break;
            default:
              return null;
          }
          if (splitted.length < 2) {
            return {
              type: actionType,
            };
          }
          let actionMetadataSplitted = splitted[1].split("|");
          let actionMetadata = {
            channel: actionMetadataSplitted[0],
            durationSeconds: parseInt(actionMetadataSplitted[1]),
            customMessage: actionMetadataSplitted[2],
          };
          return {
            type: actionType,
            metadata: actionMetadata,
          };
        });
      let enabled = interaction.options.getBoolean("enabled");
      let exemptRoles = interaction.options.getString("exemptroles").split(";");
      let exemptChannels = interaction.options
        .getString("exemptchannels")
        .split(";");
      let reason = `/${this.name} command executed by ${interaction.user.username}`;
      await autoModerationRuleManager.create({
        name,
        eventType,
        triggerType,
        triggerMetadata,
        actions,
        enabled,
        exemptRoles,
        exemptChannels,
        reason,
      });
    }
  },
};
