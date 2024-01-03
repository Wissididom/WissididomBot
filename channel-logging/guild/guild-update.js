const { Guild } = require('discord.js');

/**
 * Emitted whenever a guild is updated - e.g. name change.
 * @param {Guild} oldGuild The guild before the update
 * @param {Guild} newGuild The guild after the update
 */
async function guildUpdate(oldGuild, newGuild) {
    // TODO
}

module.exports.guildUpdate = guildUpdate;
