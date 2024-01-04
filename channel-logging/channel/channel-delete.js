const { DMChannel, GuildChannel } = require("discord.js");

/**
 * Emitted whenever a channel is deleted.
 * @param {DMChannel | GuildChannel} channel The channel that was deleted
 */
async function channelDelete(channel) {
  // TODO
}

module.exports.channelDelete = channelDelete;
