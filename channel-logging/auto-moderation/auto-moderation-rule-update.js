const { AutoModerationRule } = require('discord.js');

/**
 * Emitted whenever an auto moderation rule gets updated.
 * 
 * This event requires the `PermissionFlagsBits.ManageGuild` permission
 * @param {?AutoModerationRule} oldAutoModerationRule The auto moderation rule before the update
 * @param {AutoModerationRule} newAutoModerationRule The auto moderation rule after the update
 */
async function autoModerationRuleUpdate(oldAutoModerationRule, newAutoModerationRule) {
    // TODO
}

module.exports.autoModerationRuleUpdate = autoModerationRuleUpdate;
