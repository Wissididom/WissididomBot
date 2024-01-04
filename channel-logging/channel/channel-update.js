const { DMChannel, GuildChannel } = require("discord.js");

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change, channel type change.
 * @param {DMChannel | GuildChannel} oldChannel The channel before the update
 * @param {DMChannel | GuildChannel} newChannel The channel after the update
 */
async function channelUpdate(oldChannel, newChannel) {
  // TODO
}

module.exports.channelUpdate = channelUpdate;
