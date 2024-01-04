const { AutoModerationRule } = require("discord.js");

/**
 * Emitted whenever an auto moderation rule is created.
 *
 * This event requires the `PermissionFlagsBits.ManageGuild` permission
 * @param {AutoModerationRule} autoModerationRule The created auto moderation rule
 */
async function autoModerationRuleCreate(autoModerationRule) {
  // TODO
}

module.exports.autoModerationRuleCreate = autoModerationRuleCreate;
