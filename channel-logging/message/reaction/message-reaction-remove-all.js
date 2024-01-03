const { Collection, Message, MessageReaction, Snowflake } = require('discord.js');

/**
 * Emitted whenever all reactions are removed from a cached message.
 * @param {Message} message The message the reactions were removed from
 * @param {Collection<(string | Snowflake), MessageReaction>} reactions The cached message reactions that were removed
 */
async function messageReactionRemoveAll(messageReaction, user) {
    // TODO
}

module.exports.messageReactionRemoveAll = messageReactionRemoveAll;
