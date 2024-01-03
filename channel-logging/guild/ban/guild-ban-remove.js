const { GuildBan } = require('discord.js');

/**
 * Emitted whenever a member is unbanned from a guild.
 * @param {GuildBan} ban The ban that was removed
 */
async function guildBanRemove(ban) {
    // TODO
}

module.exports.guildBanRemove = guildBanRemove;
