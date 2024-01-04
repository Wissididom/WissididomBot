const { Guild } = require("discord.js");

/**
 * Emitted whenever a guild integration is updated.
 * @param {Guild} guild The guild whose integrations were updated
 */
async function guildIntegrationsUpdate(guild) {
  // TODO
}

module.exports.guildIntegrationsUpdate = guildIntegrationsUpdate;
