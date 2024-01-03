const { GuildMember } = require('discord.js');

/**
 * Emitted whenever a user joins a guild.
 * @param {GuildMember} member The member that has joined a guild
 */
async function guildMemberAdd(member) {
    // TODO
}

module.exports.guildMemberAdd = guildMemberAdd;
