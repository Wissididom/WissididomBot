const { MessageReaction, User } = require("discord.js");

/**
 * Emitted whenever a reaction is added to a cached message.
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user that applied the guild or reaction emoji
 */
async function messageReactionAdd(messageReaction, user) {
  // TODO
}

module.exports.messageReactionAdd = messageReactionAdd;
