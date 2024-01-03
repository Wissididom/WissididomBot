const { TextBasedChannels } = require('discord.js');

/**
 * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information can be provided easily here - you need to manually check the pins yourself.
 * @param {TextBasedChannels} channel The channel that the pins update occurred in
 * @param {Date} time The time of the pins update
 */
async function channelPinsUpdate(channel, time) {
    // TODO
}

module.exports.channelPinsUpdate = channelPinsUpdate;
