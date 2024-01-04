const { GuildScheduledEvent, User } = require("discord.js");

/**
 * Emitted whenever a user subscribes to a guild scheduled event.
 * @param {GuildScheduledEvent} guildScheduledEvent The guild scheduled event
 * @param {User} user The user who subscribed
 */
async function guildScheduledEventUserAdd(guildScheduledEvent, user) {
  // TODO
}

module.exports.guildScheduledEventUserAdd = guildScheduledEventUserAdd;
