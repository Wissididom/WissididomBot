const { GuildMember } = require('discord.js');

/**
 * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
 * @param {GuildMember} oldMember The member before the update
 * @param {GuildMember} newMember The member after the update
 */
async function guildMemberUpdate(oldMember, newMember) {
    // TODO
}

module.exports.guildMemberUpdate = guildMemberUpdate;
