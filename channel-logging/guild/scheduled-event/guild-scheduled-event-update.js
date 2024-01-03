const { GuildScheduledEvent } = require('discord.js');

/**
 * Emitted whenever a guild scheduled event gets updated.
 * @param {?GuildScheduledEvent} oldGuildScheduledEvent The guild scheduled event object before the update
 * @param {GuildScheduledEvent} newGuildScheduledEvent The guild scheduled event object after the update
 */
async function guildScheduledEventUpdate(oldGuildScheduledEvent, newGuildScheduledEvent) {
    // TODO
}

module.exports.guildScheduledEventUpdate = guildScheduledEventUpdate;
