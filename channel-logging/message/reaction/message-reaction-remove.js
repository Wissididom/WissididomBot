const { MessageReaction, User } = require("discord.js");

/**
 * Emitted whenever a reaction is removed from a cached message.
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user whose emoji or reaction emoji was removed
 */
async function messageReactionRemove(messageReaction, user) {
  // TODO
}

module.exports.messageReactionRemove = messageReactionRemove;
