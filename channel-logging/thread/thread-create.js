const { ThreadChannel } = require("discord.js");

/**
 * Emitted whenever a thread is created or when the client user is added to a thread.
 * @param {ThreadChannel} thread The thread that was created
 * @param {boolean} newlyCreated Whether the thread was newly created
 */
async function threadCreate(thread, newlyCreated) {
  // TODO
}

module.exports.threadCreate = threadCreate;
