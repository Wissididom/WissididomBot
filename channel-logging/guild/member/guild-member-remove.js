const { GuildMember } = require("discord.js");

/**
 * Emitted whenever a member leaves a guild or is kicked.
 * @param {GuildMember} member The member that has left/been kicked from the guild
 */
async function guildMemberRemove(member) {
  // TODO
}

module.exports.guildMemberRemove = guildMemberRemove;
