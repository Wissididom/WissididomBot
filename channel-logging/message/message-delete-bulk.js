const { Collection, GuildTextBasedChannel, Message, Snowflake } = require('discord.js');

/**
 * Emitted whenever messages are deleted in bulk.
 * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their id
 * @param {GuildTextBasedChannel} channel The channel that the messages were deleted in
 */
async function messageDeleteBulk(messages, channel) {
    // TODO
}

module.exports.messageDeleteBulk = messageDeleteBulk;
