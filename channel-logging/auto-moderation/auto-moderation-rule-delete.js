const { AutoModerationRule } = require("discord.js");

/**
 * Emitted whenever an auto moderation rule is deleted.
 *
 * This event requires the `PermissionFlagsBits.ManageGuild` permission
 * @param {AutoModerationRule} autoModerationRule The deleted auto moderation rule
 */
async function autoModerationRuleDelete(autoModerationRule) {
  // TODO
}

module.exports.autoModerationRuleDelete = autoModerationRuleDelete;
