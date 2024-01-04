const { Guild } = require("discord.js");

/**
 * Emitted whenever a guild becomes unavailable, likely due to a server outage.
 * @param {Guild} guild The guild that has become unavailable
 */
async function guildUnavailable(guild) {
  // TODO
}

module.exports.guildUnavailable = guildUnavailable;
