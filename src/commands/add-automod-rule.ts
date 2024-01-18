import {
  PermissionsBitField,
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerType,
  AutoModerationRuleKeywordPresetType,
  AutoModerationActionType,
  SlashCommandBuilder,
  Message,
  AutoModerationRuleManager,
  AutoModerationTriggerMetadataOptions,
  AutoModerationActionOptions,
  Interaction,
  AutoModerationActionMetadataOptions,
  AutoModerationTriggerMetadata,
} from "discord.js";
import { getComplexArgsFromMessage } from "../util";

let exportObj = {
  name: "add-automod-rule",
  description: "Adds an automod rule to the current server",
  permissions: [
    PermissionsBitField.Flags.Administrator,
    PermissionsBitField.Flags.ManageGuild,
  ],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description)
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
          .setName("mentionraidprotectionenabled")
          .setDescription("Whether to automatically detect mention raids"),
      ),
  runMessage: async (prefix: string, msg: Message) => {
    if (msg.guild?.available) {
      let autoModerationRuleManager: AutoModerationRuleManager =
        msg.guild.autoModerationRules;
      let args: { [key: string]: string } | null =
        getComplexArgsFromMessage(msg);
      if (!args) {
        await msg.reply({
          content: "You must specify a args for this command!",
        });
        return;
      }
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
      let triggerMetadata: AutoModerationTriggerMetadataOptions = {
        keywordFilter: args.keywordfilter.split(";"),
        regexPatterns: args.regexpatterns.split(";"),
        presets: args.presets.split(";").reduce((result, preset) => {
          switch (preset.toLowerCase()) {
            case "profanity":
              result.push(AutoModerationRuleKeywordPresetType.Profanity);
              break;
            case "sexualcontent":
              result.push(AutoModerationRuleKeywordPresetType.SexualContent);
              break;
            case "slurs":
              result.push(AutoModerationRuleKeywordPresetType.Slurs);
              break;
          }
          return result;
        }, [] as AutoModerationRuleKeywordPresetType[]),
        allowList: args.allowlist.split(";"),
        mentionTotalLimit: parseInt(args.mentiontotallimit, 10),
        mentionRaidProtectionEnabled:
          args.mentionraidprotectionenabled.toLowerCase() == "true",
      };
      let actions: AutoModerationActionOptions[] = args.actions
        .split(";")
        .reduce((result, action) => {
          let splitted = action.split(":");
          if (splitted.length < 1) return result;
          let actionType: AutoModerationActionType =
            AutoModerationActionType.SendAlertMessage;
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
          }
          if (splitted.length < 2) {
            result.push({ type: actionType });
            return result;
          }
          let actionMetadataSplitted = splitted[1].split("|");
          let actionMetadata = {
            channel: actionMetadataSplitted[0],
            durationSeconds: parseInt(actionMetadataSplitted[1]),
            customMessage: actionMetadataSplitted[2],
          };
          result.push({
            type: actionType,
            metadata: actionMetadata,
          });
          return result;
        }, [] as AutoModerationActionOptions[]);
      let enabled = args.enabled.toLowerCase() == "true";
      let exemptRoles = args.exemptroles.split(";");
      let exemptChannels = args.exemptchannels.split(";");
      let reason = `${prefix}${exportObj.name} command executed by ${msg.author.username}`;
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
  runInteraction: async (interaction: Interaction) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      let autoModerationRuleManager = interaction.guild.autoModerationRules;
      let name = interaction.options.getString("name");
      if (!name) {
        await interaction.reply({
          content: `You must specify a name for the AutoMod Rule! You specified: ${name}`,
        });
        return;
      }
      let eventType: AutoModerationRuleEventType =
        AutoModerationRuleEventType.MessageSend;
      let eventTypeStr = interaction.options.getString("eventtype");
      switch (eventTypeStr) {
        case "messagesend":
          eventType = AutoModerationRuleEventType.MessageSend;
          break;
        default:
          await interaction.reply({
            content: `The given event type (${eventTypeStr}) does not exist! Please use \`MessageSend\`!`,
          });
          return;
      }
      let triggerType: AutoModerationRuleTriggerType =
        AutoModerationRuleTriggerType.Keyword;
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
          await interaction.reply({
            content: `The given trigger type (${triggerTypeStr}) does not exist! Please use either \`Keyword\`, \`KeywordPreset\`, \`MentionSpam\` or \`Spam\``,
          });
          return;
      }
      let keywordFilter = interaction.options.getString("keywordfilter");
      if (!keywordFilter) {
        await interaction.reply({
          content: "You must specify keyword filters for the AutoMod Rule!",
        });
        return;
      }
      let regexPatterns = interaction.options.getString("regexpatterns");
      if (!regexPatterns) {
        await interaction.reply({
          content: "You must specify regex patterns for the AutoMod Rule!",
        });
        return;
      }
      let presets = interaction.options.getString("presets");
      if (!presets) {
        await interaction.reply({
          content: "You must specify presets for the AutoMod Rule!",
        });
        return;
      }
      let allowList = interaction.options.getString("allowlist");
      if (!allowList) {
        await interaction.reply({
          content: "You must specify an allow list for the AutoMod Rule!",
        });
        return;
      }
      let triggerMetadata: AutoModerationTriggerMetadata = {
        keywordFilter: keywordFilter.split(";"),
        regexPatterns: regexPatterns.split(";"),
        presets: presets.split(";").reduce((result, preset) => {
          switch (preset.toLowerCase()) {
            case "profanity":
              result.push(AutoModerationRuleKeywordPresetType.Profanity);
              break;
            case "sexualcontent":
              result.push(AutoModerationRuleKeywordPresetType.SexualContent);
              break;
            case "slurs":
              result.push(AutoModerationRuleKeywordPresetType.Slurs);
              break;
          }
          return result;
        }, [] as AutoModerationRuleKeywordPresetType[]),
        allowList: allowList.split(";"),
        mentionTotalLimit: interaction.options.getInteger("mentiontotallimit"),
        mentionRaidProtectionEnabled:
          interaction.options.getBoolean("mentionraidprotectionenabled") ??
          true,
      };
      let actionsStr = interaction.options.getString("actions");
      if (!actionsStr) {
        await interaction.reply({
          content: `You must specify actions for this AutoMod Rule! You've specified ${actionsStr}`,
        });
        return;
      }
      let actions: AutoModerationActionOptions[] = actionsStr
        .split(";")
        .reduce((result, action) => {
          let splitted = action.split(":");
          if (splitted.length < 1) return result;
          let actionType = AutoModerationActionType.SendAlertMessage;
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
          }
          if (splitted.length < 2) {
            result.push({ type: actionType });
            return result;
          }
          let actionMetadataSplitted = splitted[1].split("|");
          let actionMetadata: AutoModerationActionMetadataOptions = {
            channel: actionMetadataSplitted[0],
            durationSeconds: parseInt(actionMetadataSplitted[1]),
            customMessage: actionMetadataSplitted[2],
          };
          result.push({
            type: actionType,
            metadata: actionMetadata,
          });
          return result;
        }, [] as AutoModerationActionOptions[]);
      let enabled = interaction.options.getBoolean("enabled") ?? true;
      let exemptRoles = interaction.options
        .getString("exemptroles")
        ?.split(";");
      let exemptChannels = interaction.options
        .getString("exemptchannels")
        ?.split(";");
      let reason = `/${exportObj.name} command executed by ${interaction.user.username}`;
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

export default exportObj;
