const { ThreadChannel } = require("discord.js");

/**
 * Emitted whenever a thread is updated - e.g. name change, archive state change, locked state change.
 * @param {ThreadChannel} oldThread The thread before the update
 * @param {ThreadChannel} newThread The thread after the update
 */
async function threadUpdate(oldThread, newThread) {
  // TODO
}

module.exports.threadUpdate = threadUpdate;
