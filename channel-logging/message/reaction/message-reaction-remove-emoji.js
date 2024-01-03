const { MessageReaction } = require('discord.js');

/**
 * Emitted when a bot removes an emoji reaction from a cached message.
 * @param {MessageReaction} reaction The reaction that was removed
 */
async function messageReactionRemoveEmoji(reaction) {
    // TODO
}

module.exports.messageReactionRemoveEmoji = messageReactionRemoveEmoji;
