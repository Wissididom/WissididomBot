const { Message } = require("discord.js");

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @param {Message} oldMessage The message before the update
 * @param {Message} newMessage The message after the update
 */
async function messageUpdate(message) {
  // TODO
}

module.exports.messageUpdate = messageUpdate;
