const { Guild } = require('discord.js');

/**
 * Emitted whenever a guild kicks the client or the guild is deleted/left.
 * @param {Guild} guild The guild that was deleted
 */
async function guildDelete(guild) {
    // TODO
}

module.exports.guildDelete = guildDelete;
