const { AutoModerationActionExecution } = require("discord.js");

/**
 * Emitted whenever an auto moderation rule is triggered.
 *
 * This event requires the `PermissionFlagsBits.ManageGuild` permission
 * @param {AutoModerationActionExecution} autoModerationActionExecution The data of the execution
 */
async function autoModerationActionExecuted(autoModerationActionExecution) {
  // TODO
}

module.exports.autoModerationActionExecuted = autoModerationActionExecuted;
